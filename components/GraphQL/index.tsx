import {useEffect, useState} from "react";
import {MovieType} from "../../Types";
import {ListOfMovies} from "../ListOfMovies";
import styles from "./GraphQL.module.scss"


export const GraphQLComponent = ({
                                     list,
                                     error: error_,
                                     search: search_
                                 }: { list: Array<MovieType>, error: string | null, search: string }) => {


    const [search, setSearch] = useState(search_);
    const [moviesList, setMoviesList] = useState<Array<MovieType>>(list);
    const [error, setError] = useState<string | null>(error_);


    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: `{search(titleContains: "${search}"){id title}}`
        };

        fetch(process.env.APP_API + '/v1/graphql', requestOptions)
            .then(res => res.json())
            .then(data => {
                setMoviesList(data.data.search);
            })
            .catch(err => {
                setError(err.message);
                console.log(err)
            });
    }, [search]);

    return <>
        <div className={styles["search__container"]}>
            <input
                type="text"
                placeholder="Search"
                title="search"
                name='search'
                value={search}
                autoComplete={'off'}
                maxLength={100}
                onChange={(event) => setSearch(event.target.value)}
            />
        </div>
        <ListOfMovies with_search={search} adjacent_genres={null} title={""} movies={moviesList} error={error}
                      path={"movies"}/>
    </>
}

