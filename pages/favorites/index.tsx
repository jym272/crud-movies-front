import {useContext, useEffect} from "react";
import {GridOfMovies, store} from "../../components";
import {MovieType, Page} from "../../Types";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";


const FavPage = ({movies, error}: { movies: Array<MovieType>, error: string | null }) => {

    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Fav)
    }, [context])


    return <>
        <GridOfMovies movies={movies} error={error} path="movies" removeUnFavorite={true}/>
    </>
}

export default FavPage

FavPage.auth = true //client side auth

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)  //server side auth
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }
    const init = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
        }
    }

    const movies: Array<MovieType> = []
    let error: string | null = null
    let data, response;
    try {
        response = await fetch(process.env.APP_API + '/v1/user/favorites?action=list', init)
        data = await response.json()
        if (response.ok && data.movies) {
            movies.push(...data.movies)
            movies.forEach(movie => {
                movie.isFavorite = true
            })
        } else {
            context.res.statusCode = response.status
            throw new Error(data.error)
        }
    } catch (e) {
        error = `Error ${response?.status}, ${response?.statusText}`
        if (e instanceof Error) {
            error = error + `: ${e.message}`
        }
    }
    return {
        props: {
            movies,
            error,
        }
    }
}
