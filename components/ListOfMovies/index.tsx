import {MovieType} from "../../Types";
import Link from "next/link";
import styles from "./ListOfMovies.module.scss"

export const ListOfMovies = ({
                                 title,
                                 movies,
                                 error,
                                 path
                             }: { title: string, movies: MovieType[], error: string | null, path: string }) => {


    const listMoviesTitle = movies.map((movie: MovieType) => {
        return <li key={movie.id}>
            <Link href={`/${path}/${movie.id}`} passHref>
                <a>{movie.title}</a>
            </Link>
        </li>
    })

    return (
        <div>
            <h1>{title}</h1>
            {error ? <p>{error}</p> :
                listMoviesTitle.length > 0 ?
                    <ul className={styles["list__movies"]}>
                        {listMoviesTitle}
                    </ul>
                    :
                    <p>No movies</p>
            }
        </div>
    )

}
