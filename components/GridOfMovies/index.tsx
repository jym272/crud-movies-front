import {MovieType} from "../../Types";
import Image from 'next/image';
import styles from './GridOfMovies.module.scss'
import {useRouter} from "next/router";
import {FavButton} from "../FavButton/FavButton";
import React from "react";
import {useSession} from "next-auth/react";


//Config: updated info for sizes and paths
//https://api.themoviedb.org/3/configuration?api_key=f6646a0386887b9fd168de141c70bd9b
//image size available: w92, w154, w185, w342, w500, w780, original // can change
//also for correct path to poster: https://image.tmdb.org/t/p/w500/ // can change

export const GridOfMovies = ({
                                 movies,
                                 error,
                                 path,
                             }: { movies: MovieType[], error: string | null, path:string }) => {

    const router = useRouter();
    const {data: session, status} = useSession();

    //element for click on movie
    const clickedHandler = (movieId: number, event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        const id = event.currentTarget.id;
        if (id.includes('poster')) {
            router.push(`/${path}/${movieId.toString()}`);
        }
    };

    const Grid = movies.map((movie: MovieType) => {
        let imagePath = `https://image.tmdb.org/t/p/w500/${movie.poster}`;
        return <div id={`poster__${movie.id}`} onClick={clickedHandler.bind(null, movie.id)}
                    className={styles["poster__container"]}
                    key={movie.id}>

            {movie.poster ?
                <>
                    <Image src={imagePath} alt={movie.title} layout={"fill"}/>
                    {session &&
                    <div id={`favorite__${movie.id}`} className={styles["toggle__favorite__handler"]}
                    >
                        <FavButton isFavorite={movie.isFavorite as boolean} checkboxID={movie.id}
                                   accessToken={session?.accessToken as string}/>
                    </div>}

                </>
                :

                <>
                    <Image src={"/images/poster_mock.png"} alt={movie.title} layout={"fill"}/>
                    {session &&
                        <div id={`favorite__${movie.id}`} className={styles["toggle__favorite__handler"]}
                    >
                        <FavButton isFavorite={movie.isFavorite as boolean} checkboxID={movie.id}
                                   accessToken={session?.accessToken as string}/>
                    </div>}
                    <div className={styles["poster__mock__title"]}>{movie.title}</div>


                </>
            }
        </div>
    });

    return <>
        {error ? <p>{error}</p> :
            Grid.length === 0 ? <p className={styles["no__movies"]}>No movies</p> :
                <div className={styles["grid__movies__poster"]}>
                    {Grid}
                </div>
        }
    </>
}