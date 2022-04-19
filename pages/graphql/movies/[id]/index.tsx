import React from "react";
import {GetServerSideProps} from "next";
import {MovieType} from "../../../../Types";
import {MovieComponent} from "../../../../components";

const Movie = ({movie, error}: { movie: MovieType, error: string | null }) => {

    if (error) {
        return <div>{error}</div>
    }


    return <MovieComponent movie={movie} genrePath={"/graphql/genres"}/>
}

export default Movie;

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

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: `{
            movie(id: ${Number(id)})
                {
                    title
                    description
                    rating
                    runtime
                    release_date
                    mpaa_rating
                    genres_list
                    { 
                        id 
                        name 
                    }
                }
            }`
    };

    let data, response;
    try {
        response = await fetch(`http://localhost:8080/v1/graphql`, requestOptions);
        data = await response.json()
        if (response.ok && data.data.movie) {
            movie = data.data.movie;
        } else {
            if (data.data.movie === null) {
                throw new Error('Movie not found')
            }
            context.res.statusCode = response.status
            throw new Error(data.error)
        }
    } catch (e) {
        error = `Error ${response?.status}, ${response?.statusText}`
        if (e instanceof Error) {
            error = error + `: ${e.message}`
        }
    }
    return {
        props: {
            movie: movie,
            error
        }
    }
}

