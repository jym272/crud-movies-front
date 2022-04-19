import {MovieType} from "../../Types";
import React from "react";
import styles from "./Movie.module.scss"
import Link from "next/link";


export const MovieComponent = ({movie, genrePath}: { movie: MovieType, genrePath: string }) => {

    let movieGenresList;
    if (movie.genres) {
        movieGenresList = Object.keys(movie.genres).map((index) => {
            return <span className={styles.classification} key={index}><Link
                href={`${genrePath}/${index}`}>{movie.genres![index as unknown as number]}</Link></span>
        })
    }
    if (movie.genres_list) { //graphQL
        movieGenresList = movie.genres_list.map((genre, index) => {
            return <span className={styles.classification} key={index}><Link
                href={`${genrePath}/${genre.id}`}>{genre.name}</Link></span> //these genre endpoints don't use graphQL //TODO: create these endpoints
        })
    }

    const date = new Date(movie.release_date)
    const dateString = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC"
    });


    return <>
        <h1 className={styles.title}>{movie.title}</h1>
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
    </>
}

