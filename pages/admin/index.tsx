import {useContext, useEffect} from "react";
import {ListOfMovies, store} from "../../components";
import {ComponentWithAuth, MovieType, Page} from "../../Types";
import {GetServerSideProps} from "next";

const Catalog: ComponentWithAuth<{ movies: Array<MovieType>, error: string | null }> = ({movies, error}) => {
    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Catalog)
    }, [context])
    return <>
        <ListOfMovies title={"Edit Movies"} movies={movies} error={error} path="admin/movie/edit"/>
    </>
}
export default Catalog

Catalog.auth = true

//TODO: refactorizar luego, mismo contenido en catalog y movies
//TODO: IMPORTANTE; la página se pre renderiza siempre (en el server), la autenticación viene luego
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