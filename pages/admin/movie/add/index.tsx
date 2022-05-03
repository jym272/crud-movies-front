import React, {useContext, useEffect} from "react";
import {AddMovieForm, store} from "../../../../components";
import {ComponentWithAuth, Genres, MovieType, Page} from "../../../../Types";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";

const Add: ComponentWithAuth<{ error: string | null, genres_list:Genres[] }> = ({ error, genres_list}) => {

    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Add)
    }, [context])
    if (error) {
        return <div>{error}</div>
    }

    return <AddMovieForm movie={null} genres_list={genres_list}/>

}


export default Add

Add.auth = true //client side auth


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


    let genres_list: Genres[] = []
    let error: string | null = null
    const response = await fetch(process.env.APP_API + '/v1/graphql', requestOptions);
    if (response.ok) {
        const data = await response.json()
        genres_list = data.data.genres_list
    } else {
        context.res.statusCode = response.status
        error = `Error ${response.status}, ${response.statusText}`
    }

    return {
        props: {
            error,
            genres_list
        }
    }
}