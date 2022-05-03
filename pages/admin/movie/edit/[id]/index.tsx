import {ComponentWithAuth, Genres, MovieType} from "../../../../../Types";
import {AddMovieForm} from "../../../../../components";
import React from "react";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";

const EditMovie: ComponentWithAuth<{ movie: MovieType, error: string | null, genres_list:Genres[] }> = ({movie, error, genres_list}) => {

    if (error) {
        return <div>{error}</div>
    }
    return <AddMovieForm movie={movie} genres_list={genres_list}/>
}

export default EditMovie;
EditMovie.auth = true; //client side auth
// The authentication is given in two ways, either by the server or by the client.
// The server is first if the client try to access de page without for the first time.
// The page is not rendered if the user is not authenticated, if it is authenticated, the page is rendered.
// and client side authentication is done by the Auth component.
export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)  //server side auth
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    const id = context.params?.id;
    const regex = /^\d+$/;
    if (!regex.test(id as string)) {
        return {
            notFound: true
        }
    }
    let movie: MovieType | null = null;
    let error: string | null = null
    let genres_list:Genres[] = [];
    let response = await fetch(`${process.env.APP_API}/v1/movie/${id}`);

    if (response.ok) {
        const data = await response.json()
        movie = data.movie
    } else {
        context.res.statusCode = response.status
        error = `Error ${response.status}, ${response.statusText}`
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: `{
                    genres_list
                    {
                        id
                        name
                    }
                }`
    };


    response = await fetch(process.env.APP_API + '/v1/graphql', requestOptions);
    if (response.ok) {
        const data = await response.json()
        genres_list = data.data.genres_list
    } else {
        context.res.statusCode = response.status
        error = `Error ${response.status}, ${response.statusText}`
    }

    return {
        props: {
            movie: movie,
            error,
            genres_list
        }
    }
}