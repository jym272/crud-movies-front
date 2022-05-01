import {MovieType} from "../../Types";
import Image from 'next/image';
import styles from './GridOfMovies.module.scss'
import {useRouter} from "next/router";


//Config: updated info for sizes and paths
//https://api.themoviedb.org/3/configuration?api_key=f6646a0386887b9fd168de141c70bd9b
//image size available: w92, w154, w185, w342, w500, w780, original // can change
//also for correct path to poster: https://image.tmdb.org/t/p/w500/ // can change

export const GridOfMovies = ({
                                 movies,
                                 error,
                             }: { movies: MovieType[], error: string | null }) => {

    const router = useRouter();


    const goToMovieHandler = (movieId: number) => {
        router.push(`/graphql/movies/${movieId}`)
    }


    const Grid = movies.map((movie: MovieType) => {
        let imagePath = `https://image.tmdb.org/t/p/w500/${movie.poster}`;
        return <div onClick={goToMovieHandler.bind(this, movie.id)} className={styles["poster__container"]}
                    key={movie.id}>

            {movie.poster ?
                <>
                    <Image src={imagePath} alt={movie.title} layout={"fill"}/>
                    <div className={styles["toggle__favorite__handler"]}>{}</div>

                </>
                :

                <>
                    <Image src={"/images/poster_mock.png"} alt={movie.title} layout={"fill"}/>
                    <div className={styles["poster__mock__title"]}>{movie.title}</div>
                    <div className={styles["toggle__favorite__handler"]}>{}</div>

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