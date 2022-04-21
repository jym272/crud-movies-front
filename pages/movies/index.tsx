import {useContext, useEffect} from "react";
import {ListOfMovies, store} from "../../components";
import {MovieType, Page} from "../../Types";
import {GetServerSideProps} from "next";

const Movies = ({movies, error}: { movies: Array<MovieType>, error: string | null }) => {
    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Movies)
    }, [context])

    return <>
        <ListOfMovies title={"Movies"} movies={movies} error={error} path="movies"/>
    </>
}
export default Movies


export const getServerSideProps: GetServerSideProps = async (context) => {
    let movies = [];
    let error = null;

    const response = await fetch(process.env.APP_API + '/v1/movies')
    if (response.ok) {
        const data = await response.json()
        movies = data.movies
    } else {
        context.res.statusCode = response.status
        error = `Error ${response.status}, ${response.statusText}`
    }

    return {
        props: {
            movies,
            error
        }
    }
}