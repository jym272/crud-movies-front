import {Adjacent_Genres, MovieType} from "../../Types";
import Link from "next/link";
import styles from "./ListOfMovies.module.scss"
import {store} from "../Store";
import React, {useContext} from "react";
import {useRouter} from "next/router";

export const ListOfMovies = ({
                                 title,
                                 movies,
                                 error,
                                 path,
                                 adjacent_genres
                             }: {
    title: string, movies: MovieType[],
    error: string | null, path: string,
    adjacent_genres: Adjacent_Genres | null
}) => {

    const context = useContext(store);
    const router = useRouter();

    const listMoviesTitle = movies.map((movie: MovieType) => {
        return <li key={movie.id}>
            <Link href={`/${path}/${movie.id}${adjacent_genres ? "?withgenre="+adjacent_genres.actual.id:""}`} passHref>
                <a>{movie.title}</a>
            </Link>
        </li>
    })

    return (
        <div className={context.darkMode ? styles.movies__darkMode : styles.movies}>
            {adjacent_genres && <div className={styles["genres__nav"]}>
                <div className={styles["previous__genre"]}>
                    <Link href={`/genres/${adjacent_genres.previous.id}`} passHref>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4.59 6.59L12 12L19.41 6.59L21 8L12 19L3 8L4.59 6.59Z"
                                fill="white"/>
                        </svg>
                    </Link>
                    <div onClick={()=>{router.push(`/genres/${adjacent_genres.previous.id}`)}}>
                        {adjacent_genres.previous.name}
                    </div>
                </div>
                <div className={styles["next__genre"]}>
                    <div  onClick={()=>{router.push(`/genres/${adjacent_genres.next.id}`)}}>
                        {adjacent_genres.next.name}
                    </div>
                    <Link href={`/genres/${adjacent_genres.next.id}`} passHref>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4.59 6.59L12 12L19.41 6.59L21 8L12 19L3 8L4.59 6.59Z"
                                fill="white"/>
                        </svg>
                    </Link>

                </div>
            </div>
            }
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
