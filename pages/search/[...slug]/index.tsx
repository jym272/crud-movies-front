import {GraphQLComponent} from "../../../components";
import {GetServerSideProps} from "next";
import {MovieType} from "../../../Types";

const Query = ({
                   moviesList,
                   error,
                   search,
               }: { moviesList: Array<MovieType>, error: string | null, search: string }) => {
    return <GraphQLComponent list={moviesList} error={error} search={search}/>
}

export default Query;


export const getServerSideProps: GetServerSideProps = async (context) => {

    const slug = context.params!.slug as string[]
    const search = slug[0] ? slug[0] : "";
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
            search,
        }
    }
}