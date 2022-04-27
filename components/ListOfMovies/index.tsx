import {MovieType} from "../../Types";
import Link from "next/link";
import styles from "./ListOfMovies.module.scss"
import {store} from "../Store";
import {useContext} from "react";

export const ListOfMovies = ({
                                 title,
                                 movies,
                                 error,
                                 path
                             }: { title: string, movies: MovieType[], error: string | null, path: string }) => {

    const context = useContext(store);

    const listMoviesTitle = movies.map((movie: MovieType) => {
        return <li key={movie.id}>
            <Link href={`/${path}/${movie.id}`} passHref>
                <a>{movie.title}</a>
            </Link>
        </li>
    })

    return (
        <div className={ context.darkMode ? styles.movies__darkMode:styles.movies }>
            <h1>{title}</h1>
            {error ? <p>{error}</p> :
                listMoviesTitle.length > 0 ?
                    <ul className={styles["list__movies"]}>
                        {listMoviesTitle}
                    </ul>
                    :
                    <p className={styles["no__movies"]}>No movies</p>
            }
        </div>
    )

}
