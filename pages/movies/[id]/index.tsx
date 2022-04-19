import React from "react";
import {GetServerSideProps} from "next";
import {MovieType} from "../../../Types";
import {MovieComponent} from "../../../components";

const Movie = ({movie, error}: { movie: MovieType, error: string | null }) => {

    if (error) {
        return <div>{error}</div>
    }

    return <MovieComponent movie={movie}/>
}

export default Movie;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params?.id;
    //TODO: maybe in a future use the query along with authorization to edit the movie and avoid repeated code
    // const queryEdit = context.query?.edit;
    // console.log(queryEdit)
    const regex = /^\d+$/;
    if (!regex.test(id as string)) {
        return {
            notFound: true
        }
    }
    let movie: MovieType | null = null;
    let error: string | null = null
    const response = await fetch(`http://localhost:8080/v1/movie/${id}`);

    if (response.ok) {
        const data = await response.json()
        console.log(data)
        movie = data.movie
    } else {
        context.res.statusCode = response.status
        error = `Error ${response.status}, ${response.statusText}`
    }
    return {
        props: {
            movie: movie,
            error
        }
    }
}

