import React from "react";
import {GetServerSideProps} from "next";
import {MovieType} from "../../../../Types";
import {MovieComponent} from "../../../../components";
import {getSession} from "next-auth/react";

const Movie = ({movie, error, isFav}: { movie: MovieType, error: string | null, isFav:boolean }) => {

    if (error) {
        return <div>{error}</div>
    }


    return <MovieComponent movie={movie} path={"graphql"} isFav={isFav}/>
}

export default Movie;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)  //server side auth

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
                    poster
                    rating
                    runtime
                    release_date
                    mpaa_rating
                    genres_list
                    { 
                        id 
                        name 
                    }
                    adjacent_movies_ids
                    {
                        next
                        previous
                    }
                    
                }
            }`
    };

    let data, response;
    try {
        response = await fetch(`${process.env.APP_API}/v1/graphql`, requestOptions);
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

    let isFav: boolean = false;
    if (session && movie) {
        movie.id = parseInt(id as string); //add id to movie //TODO: make this in graphql
        const response = await  fetch(`${process.env.APP_API}/v1/user/favorites?movie=${movie.id}&action=query`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.accessToken}`
            }
        })
        if (response.ok) {
            const data = await response.json()
            if (data == "favorite"){
                isFav = true
            }
        }
    }

    return {
        props: {
            movie: movie,
            error,
            isFav
        }
    }
}

