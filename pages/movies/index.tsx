import {useContext, useEffect} from "react";
import {GridOfMovies, ListOfMovies, store} from "../../components";
import {MovieType, Page} from "../../Types";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";

const Movies = ({movies, error}: { movies: Array<MovieType>, error: string | null }) => {
    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Movies)
    }, [context])

    return <>
        <GridOfMovies movies={movies} error={error} path="movies"/>
    </>
}
export default Movies


export const getServerSideProps: GetServerSideProps = async (context) => {

    const session = await getSession(context)  //server side auth
    let movies:Array<MovieType> =[]
    let error:string|null = null;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: `{
                    list
                    {
                        id
				    	title
						poster
                    
                    }
                }`
    };
    const response = await fetch(`${process.env.APP_API}/v1/graphql`, requestOptions);
    if (response.ok) {
        const data = await response.json()
        movies = data.data.list
    } else {
        context.res.statusCode = response.status
        error = `Error ${response.status}, ${response.statusText}`
    }
    if (session){
        const moviesIdsArray = movies.map(movie => movie.id)
        const payload = {
            ids: moviesIdsArray
        }
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.accessToken}`
            },
            body: JSON.stringify(payload)
        }
        interface DataType {
            [key: string]: boolean
        }

        let data:DataType, response;
        try {
            response = await fetch(process.env.APP_API + '/v1/user/favorites?action=retrievefavorites', init)
            data = await response.json()
            if (response.ok && data) {
                movies.forEach(movie => {
                    movie.isFavorite = data[movie.id]
                })

            } else {
                context.res.statusCode = response.status
                throw new Error(data.error as unknown as string)
            }
        } catch (e) {
            error = `Error ${response?.status}, ${response?.statusText}`
            if (e instanceof Error) {
                error = error + `: ${e.message}`
            }
        }
    }

    return {
        props: {
            movies,
            error
        }
    }
}