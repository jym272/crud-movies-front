import {useContext, useEffect} from "react";
import {GenresComponent, store} from "../../components";
import {Genres, Page} from "../../Types";
import {GetServerSideProps} from "next";

const Genres = ({genres, error}: { genres: Array<Genres>, error: string | null }) => {
    const context = useContext(store)
    useEffect(() => {
        context.setActivePage(Page.Genres)
    }, [context])
    if (error) {
        return <div>{error}</div>
    }
    return <>
        <GenresComponent genres={Object.values(genres)}/>
    </>

}
export default Genres


export const getServerSideProps: GetServerSideProps = async (context) => {
    let genres = [];
    let error = null;

    const response = await fetch('http://localhost:8080/v1/genres')
    if (response.ok) {
        const data = await response.json()
        genres = data.genres
    } else {
        context.res.statusCode = response.status
        error = `Error ${response.status}, ${response.statusText}`
    }

    return {
        props: {
            genres,
            error
        }
    }
}