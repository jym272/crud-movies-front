import {MovieType} from "../../Types";
import Link from "next/link";

export const ListOfMovies = ({title, movies, error}: { title: string, movies: MovieType[], error: string | null }) => {


    const listMoviesTitle = movies.map((movie: MovieType) => {
        return <li key={movie.id}>
            <Link href={`/movies/${movie.id}`}>
                <a>{movie.title}</a>
            </Link>
        </li>
    })

    return (
        <div>
            <h1>{title}</h1>
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
