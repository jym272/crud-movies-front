import {useContext, useEffect} from "react";
import {MovieType, Page} from "../../Types";
import {GraphQLComponent, store} from "../../components";
import {GetServerSideProps} from "next";


const Graphql = ({moviesList, error}: { moviesList: Array<MovieType>, error: string | null }) => {
    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.GraphQL)
    }, [context])


    return <GraphQLComponent list={moviesList} error={error} search={""}/>

}
export default Graphql


export const getServerSideProps: GetServerSideProps = async (context) => {


    const search = ""; //all movies
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: `{search(titleContains: "${search}"){id title}}`
    };

    const moviesList: Array<MovieType> = []
    let error: string | null = null
    let data, response;
    try {
        response = await fetch(process.env.APP_API + '/v1/graphql', requestOptions)
        data = await response.json()
        if (response.ok && data.data.search) {
            moviesList.push(...data.data.search)
        } else {
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
            moviesList,
            error,
        }
    }
}

