import {GetServerSideProps} from "next";
import {useContext, useEffect} from "react";
import {MovieType, Page} from "../../../../Types";
import {ListOfMovies, store} from "../../../../components";

const Genre = ({movies, genreTitle, error}: { movies: Array<MovieType>, genreTitle: string, error: string | null }) => {

    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Genres)
    }, [context])

    return <>
        <ListOfMovies title={genreTitle} movies={movies} error={error} path="graphql/movies"/>
    </>

}
export default Genre;

export const getServerSideProps: GetServerSideProps = async (context) => {

    const genreID = context.params?.genre as string
    let movies: any[] = [];
    let genreName = "";
    let error = null;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: `{genre(genreId: ${Number(genreID)}){id title}}`
    };


    let data, response;
    try {
        response = await fetch(`${process.env.APP_API}/v1/graphql`, requestOptions);
        data = await response.json()
        if (response.ok && data.data) {
            Object.entries(data.data).forEach(([key, value]) => {
                genreName = key
                movies = value as Array<any>
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
            genreTitle: genreName,
            error
        }
    }
}


