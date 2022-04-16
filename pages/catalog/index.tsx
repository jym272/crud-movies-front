import {useContext, useEffect} from "react";
import {ListOfMovies, store} from "../../components";
import {MovieType, Page} from "../../Types";
import {GetServerSideProps} from "next";

const Catalog = ({movies, error}: { movies: Array<MovieType>, error: string | null }) => {
    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Catalog)
    }, [context])
    return <>
        <ListOfMovies title={"Edit Movies"} movies={movies} error={error} path="admin/movie/edit"/>
    </>
}
export default Catalog


//TODO: refactorizar luego, mismo contenido en catalog y movies
export const getServerSideProps: GetServerSideProps = async (context) => {
    let movies = [];
    let error = null;

    const response = await fetch('http://localhost:8080/v1/movies')
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