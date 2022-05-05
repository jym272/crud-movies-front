import {GetServerSideProps} from "next";
import {Adjacent_Genres, MovieType, Page} from "../../../Types";
import {useContext, useEffect} from "react";
import {ListOfMovies, store} from "../../../components";

const Genre = ({movies, genreTitle, error, adjacent_genres}: { movies: Array<MovieType>, genreTitle: string, error: string | null, adjacent_genres: Adjacent_Genres | null }) => {

    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Genres)
    }, [context])

    return <>
        <ListOfMovies with_search={undefined} title={genreTitle} movies={movies} error={error} path="movies" adjacent_genres={adjacent_genres}/>
    </>

}
export default Genre;

export const getServerSideProps: GetServerSideProps = async (context) => {

    const genreID = context.params?.genre as string
    let movies = [];
    let genreName = "";
    let error = null;
    let adjacent_genres: Adjacent_Genres|null = null;                                                    //adjacent_genres_ids only if genre_id is requested
    const response = await fetch(`${process.env.APP_API}/v1/movies?genre_id=${genreID}&adjacent_genres_ids=true`)
    if (response.ok) {
        const data = await response.json()
        genreName = data.genre_name
        movies = data.movies
        adjacent_genres = data.adjacent_genres as Adjacent_Genres
        adjacent_genres.actual = {
            id: parseInt(genreID),
            name: genreName
        }

    } else {
        context.res.statusCode = response.status
        error = `Error ${response.status}, ${response.statusText}`
    }
    return {
        props: {
            movies,
            genreTitle: genreName,
            error,
            adjacent_genres
        }
    }
}