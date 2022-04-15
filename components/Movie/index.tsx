import {MovieType} from "../../Types";
import React from "react";
import styles from "./Movie.module.scss"
import Link from "next/link";


export const MovieComponent = ({movie}: { movie: MovieType }) => {

    const movieGenresList = Object.keys(movie.genres).map((index) => {
        return <span className={styles.classification} key={index}><Link
            href={`/genres/${index}`}>{movie.genres[index as unknown as number]}</Link></span>
    })
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

