import {MovieType} from "../../Types";
import React, {useContext} from "react";
import styles from "./Movie.module.scss"
import Link from "next/link";
import Image from "next/image";
import {store} from "../Store";
import {useSession} from "next-auth/react";
import {FavButton} from "../FavButton/FavButton";
import {useRouter} from "next/router";

//Config: updated info for sizes and paths
//https://api.themoviedb.org/3/configuration?api_key=f6646a0386887b9fd168de141c70bd9b
//image size available: w92, w154, w185, w342, w500, w780, original // can change
//also for correct path to poster: https://image.tmdb.org/t/p/w500/ // can change

export const MovieComponent = ({
                                   movie,
                                   cancelPath,
                                   isFav
                               }: { movie: MovieType, cancelPath: string, isFav: boolean }) => {
    const {data: session, status} = useSession();
    const context = useContext(store)
    const router = useRouter()


    let movieGenresList;
    if (movie.genres) {
        movieGenresList = Object.keys(movie.genres).map((index) => {
            return <span className={styles.classification} key={index}><Link
                href={`/genres/${index}`}>{movie.genres![index as unknown as number]}</Link></span>
        })
    }
    if (movie.genres_list) { //graphQL
        movieGenresList = movie.genres_list.map((genre, index) => {
            return <span className={styles.classification} key={index}><Link
                href={`/graphql/genres/${genre.id}`}>{genre.name}</Link></span> //these genre endpoints don't use graphQL //TODO: create these endpoints
        })
    }

    const date = new Date(movie.release_date)
    const dateString = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC"
    });

    const imagePath = `https://image.tmdb.org/t/p/w500/${movie.poster}`;
    const uniqueMovie = (movie.id === movie.adjacent_movies_ids?.previous && movie.id === movie.adjacent_movies_ids?.next)
    return <div className={context.darkMode ? styles.movie__darkMode : styles.movie}>
        <div className={styles.header}>
            <h2>{movie.withGenre ? movie.withGenre.name : movie.withSearch ? "Search: " + movie.withSearch : movie.withFav ? "My Favorites" : ""}</h2>
            <div className={styles["buttons__navigation"]}>
                <button className={uniqueMovie ? styles["backwards__disabled"] : styles.backwards}
                        onClick={() => router.push(`/movies/${movie.adjacent_movies_ids?.previous}${movie.withGenre ? "?withgenre=" + movie.withGenre.id : ""}${movie.withSearch != undefined ? "?withsearch=" + movie.withSearch : ""}${movie.withFav  ? "?withfav=true": ""}`)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
                            fill="white"/>
                    </svg>
                </button>
                <button className={styles.cancel} onClick={() => router.push(cancelPath)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                            fill="white"/>
                    </svg>
                </button>

                <button className={uniqueMovie ? styles["forwards__disabled"] : styles.forwards}
                        onClick={() => router.push(`/movies/${movie.adjacent_movies_ids?.next}${movie.withGenre ? "?withgenre=" + movie.withGenre.id : ""}${movie.withSearch != undefined ? "?withsearch=" + movie.withSearch : ""}${movie.withFav  ? "?withfav=true": ""}`)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
                            fill="white"/>
                    </svg>
                </button>
            </div>
        </div>

        <div className={styles["movie__header"]}>
            <h1 className={styles.title}>{movie.title}</h1>
            {session &&
                <FavButton key={router.query.id as string} isFavorite={isFav} checkboxID={movie.id}
                           accessToken={session.accessToken as string}/>}

        </div>
        <div className={styles.ImageContainer}>
            {movie.poster ?
                <Image src={imagePath} alt={movie.title} layout={"fill"} objectFit={"contain"} priority={true}/>
                : <div className={styles["poster__container"]}><Image src={"/images/poster_mock.png"} alt={movie.title}
                                                                      layout={"fill"} priority={true}/>
                    <div className={styles["poster__mock__title"]}>{movie.title}</div>
                </div>}
        </div>
        <div className={styles["rating__classification"]}>
            <span>Rating: {movie.mpaa_rating}</span>
            <span>{movieGenresList}</span>
        </div>
        <div className={styles.info}>
            <div>
                <span>Title:</span>
                <span className={styles.content}>{movie.title}</span>
            </div>
            <div>
                <span>Description:</span>
                <span className={styles.content}>{movie.description}</span>
            </div>
            <div>
                <span>Runtime:</span>
                <span className={styles.content}>{movie.runtime}</span>
            </div>
            <div>
                <span>Release Date:</span>
                <span className={styles.content}>{dateString}</span>
            </div>
            <div>
                <span>Rating:</span>
                <span className={styles.content}>{movie.rating}</span>
            </div>
        </div>
    </div>
}

