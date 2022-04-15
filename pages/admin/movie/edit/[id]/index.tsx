import {MovieType} from "../../../../../Types";
import {AddMovieForm} from "../../../../../components";
import React from "react";
import {GetServerSideProps} from "next";

const EditMovie = ({movie, error}: { movie: MovieType, error: string | null }) => {

    if (error) {
        return <div>{error}</div>
    }
    return <AddMovieForm movie={movie}/>
}

export default EditMovie;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params?.id;
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