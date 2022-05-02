import {MovieType} from "../../Types";
import React, {useContext, useEffect} from "react";
import styles from "./Movie.module.scss"
import Link from "next/link";
import Image from "next/image";
import {store} from "../Store";
import {useSession} from "next-auth/react";

//Config: updated info for sizes and paths
//https://api.themoviedb.org/3/configuration?api_key=f6646a0386887b9fd168de141c70bd9b
//image size available: w92, w154, w185, w342, w500, w780, original // can change
//also for correct path to poster: https://image.tmdb.org/t/p/w500/ // can change

export const MovieComponent = ({movie, genrePath, isFav}: { movie: MovieType, genrePath: string, isFav:boolean }) => {
    const {data: session, status} = useSession();
    const context = useContext(store)
    const [isFavorite, setIsFavorite] = React.useState(isFav);

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

    const imagePath = `https://image.tmdb.org/t/p/w500/${movie.poster}`;

    const addToFavHandler = async () => {


        if (session && session.user) {
            const init = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.accessToken}`
                }
            }
            if (isFavorite){ //remove from favorites
                fetch(`${process.env.APP_API}/v1/user/favorites?movie=${movie.id}&action=remove`, init)
                    .then(res => res.json())
                    .then(data => {
                        if (data == "removed") {
                            setIsFavorite(false)
                        } else {
                            setIsFavorite(true)
                        }
                    }).catch(err => console.log(err))

            }else{ //add to favorites
                fetch(`${process.env.APP_API}/v1/user/favorites?movie=${movie.id}&action=add`, init)
                    .then(res => res.json())
                    .then(data => {
                        if (data == "added") {
                            setIsFavorite(true)
                        } else {
                            setIsFavorite(false)
                        }
                    }).catch(err => console.log(err))

            }

        }
    }


    return <div className={context.darkMode ? styles.movie__darkMode : styles.movie}>
        <div className={styles.header}>
            <h1 className={styles.title}>{movie.title}</h1>
            {session && <div className={styles.fav} onClick={addToFavHandler}>{isFavorite?"fav":"noFav"}</div>}
        </div>

        {movie.poster && <div className={styles.ImageContainer}>
            <Image src={imagePath} alt={movie.title} layout={"fill"} objectFit={"contain"}/>
        </div>}

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

