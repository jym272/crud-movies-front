import React, {useEffect} from "react";
import {GetServerSideProps} from "next";
import {MovieType} from "../../../Types";
import {MovieComponent} from "../../../components";
import {getSession, useSession} from "next-auth/react";

const Movie = ({movie, error, isFav}: { movie: MovieType, error: string | null, isFav:boolean }) => {

    if (error) {
        return <div>{error}</div>
    }

    return <MovieComponent movie={movie} genrePath={"/genres"} isFav={isFav}/>
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
    const response = await fetch(`${process.env.APP_API}/v1/movie/${id}`);

    if (response.ok) {
        const data = await response.json()
        movie = data.movie
    } else {
        context.res.statusCode = response.status
        error = `Error ${response.status}, ${response.statusText}`
    }


    let isFav: boolean = false;

    if (session && movie) {
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
            isFav,
        }
    }
}

