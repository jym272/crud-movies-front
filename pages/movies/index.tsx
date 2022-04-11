import {useContext, useEffect} from "react";
import {store} from "../../components";
import {MovieType, Page} from "../../Types";
import Link from "next/link";
import {GetServerSideProps} from "next";

const Movies = ({movies, error}: { movies: Array<MovieType>, error: string | null }) => {
    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Movies)
    }, [context])

    const listMoviesTitle = movies.map((movie: MovieType) => {
        return <li key={movie.id}>
            <Link href={`/movies/${movie.id}`}>
                <a>{movie.title}</a>
            </Link>
        </li>
    })

    return (
        <div>
            <h1>Movies</h1>
            {error ? <p>{error}</p> :
                listMoviesTitle.length > 0 ?
                    <ul>
                        {listMoviesTitle}
                    </ul>
                    :
                    <p>No movies</p>
            }
        </div>
    )
}
export default Movies


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