import {useContext, useEffect} from "react";
import {ListOfMovies, store} from "../../components";
import {ComponentWithAuth, MovieType, Page} from "../../Types";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";

const Catalog: ComponentWithAuth<{ movies: Array<MovieType>, error: string | null }> = ({movies, error}) => {
    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Catalog)
    }, [context])
    return <>
        <ListOfMovies with_search={undefined} adjacent_genres={null} title={"Edit My Movies"} movies={movies} error={error} path="admin/movie/edit"/>
    </>
}
export default Catalog

Catalog.auth = true //client side auth

// The authentication is given in two ways, either by the server or by the client.
// The server is first if the client try to access de page without for the first time.
// The page is not rendered if the user is not authenticated, if it is authenticated, the page is rendered.
// and client side authentication is done by the Auth component.
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
    let movies = [];
    let error = null;

    const init = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`
        }
    }

    const response = await fetch(process.env.APP_API + '/v1/admin',init)
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