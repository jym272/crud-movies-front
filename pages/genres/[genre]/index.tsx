import {GetServerSideProps} from "next";
import {MovieType, Page} from "../../../Types";
import {useContext, useEffect} from "react";
import {ListOfMovies, store} from "../../../components";

const Genre = ({movies, genreTitle, error}: { movies: Array<MovieType>, genreTitle: string, error: string | null }) => {

    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Genres)
    }, [context])

    return <>
        <ListOfMovies title={genreTitle} movies={movies} error={error} path="movies"/>
    </>

}
export default Genre;

export const getServerSideProps: GetServerSideProps = async (context) => {

    const genreID = context.params?.genre as string
    let movies = [];
    let genreName = "";
    let error = null;

    const response = await fetch(`${process.env.APP_API}/v1/movies?genre_id=${genreID}`)
    if (response.ok) {
        const data = await response.json()
        movies = Object.keys(data).map((key) => {
            genreName = key
            return data[key]
        })
    } else {
        context.res.statusCode = response.status
        error = `Error ${response.status}, ${response.statusText}`
    }

    return {
        props: {
            movies: movies[0],
            genreTitle: genreName,
            error
        }
    }
}