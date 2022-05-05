import React, {useEffect} from "react";
import {GetServerSideProps} from "next";
import {MovieType} from "../../../Types";
import {MovieComponent} from "../../../components";
import {getSession, useSession} from "next-auth/react";

const Movie = ({movie, error, isFav, cancelPath}: { movie: MovieType, error: string | null, isFav:boolean, cancelPath:string }) => {

    if (error) {
        return <div>{error}</div>
    }

    return <MovieComponent movie={movie} cancelPath={cancelPath} isFav={isFav}/>
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
    //query
    const withGenre = context.query.withgenre as string;
    const withSearch = context.query.withsearch ;

    let movie: MovieType | null = null;
    let error: string | null = null
    let cancelPath = "/movies";
    const response = await fetch(`${process.env.APP_API}/v1/movie/${id}?adjacent_ids=true&withgenre=${withGenre?withGenre:""}&withsearch=${withSearch?withSearch:""}`);

    if (response.ok) {
        const data = await response.json()
        movie = data.movie as MovieType
        if (withGenre){
            movie.withGenre = {
                id: parseInt(withGenre),
                name: data.with_genre_name
            }
            cancelPath = `/genres/${movie.withGenre.id}`
        }
        if(withSearch!= undefined || withSearch){
            movie.withSearch = withSearch as string
            cancelPath = `/search/${movie.withSearch}`
            //transform to valid path using %20
            // const transformedSearch = movie.withSearch.replace(/ /g, "%20")

        }
        movie.adjacent_movies_ids = {
            previous: data.adjacent_ids.ids[0],
            next: data.adjacent_ids.ids[1]
        }
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
            cancelPath,
        }
    }
}

