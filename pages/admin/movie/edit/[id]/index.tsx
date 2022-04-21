import {ComponentWithAuth, MovieType} from "../../../../../Types";
import {AddMovieForm} from "../../../../../components";
import React from "react";
import {GetServerSideProps} from "next";

const EditMovie: ComponentWithAuth<{ movie: MovieType, error: string | null }> = ({movie, error}) => {

    if (error) {
        return <div>{error}</div>
    }
    return <AddMovieForm movie={movie}/>
}

export default EditMovie;
EditMovie.auth = true;

//TODO: IMPORTANTE; la página se pre renderiza siempre (en el server), la autenticación viene luego
//y es del lado del cliente, el códgio del cliente se puede cambiar cargando un JWT, sin embargo,
//el server se encuentra validado. Se puede atenticar en lado del servidor usando NextAuth con useSession
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
    const response = await fetch(`${process.env.APP_API}/v1/movie/${id}`);

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