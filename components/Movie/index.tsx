import {MovieType} from "../../Types";
import React from "react";
import styles from "./Movie.module.scss"


export const MovieComponent = ({movie}: { movie: MovieType }) => {

    const movieGenresList = Object.values(movie.genres).map((genre, index) => {
        return <span className={styles.classification} key={index}>{genre}</span>
    })

    const date = new Date(movie.release_date)
    const dateString = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC"
    });

    console.log(movie, dateString)

    return <>
        <h1>{movie.title}</h1>
        <div className={styles["rating__classification"]}>
            <span>Rating: {movie.mpaa_rating}</span>
            <span>{movieGenresList}</span>
        </div>
        <div className={styles.info}>
            <span>Title:</span>
            <div className={styles.content}>{movie.title}</div>
            <span>Description:</span>
            <div className={styles.content}>{movie.description}</div>
            <span>Runtime</span>
            <div className={styles.content}>{movie.runtime}</div>
            <span>Release Date:</span>
            <div className={styles.content}>{dateString}</div>
            <span>Rating:</span>
            <div className={styles.content}>{movie.rating}</div>
        </div>
    </>
}

