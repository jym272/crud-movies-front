import styles from "./AddMovieForm.module.scss"
import React, {useEffect} from "react";
import {Genres, GenresMap, MovieType, MPAARating} from "../../Types";
import {useRouter} from "next/router";
import {store} from "../Store";
import {useSession} from "next-auth/react";

type ReducerStateType = {
    success: boolean
    error: boolean
    message: string
}
type ReducerActionType = {
    type: "success" | "error" | "reset"
    payload: string
}

function init(initialState: boolean): ReducerStateType {
    return {
        success: initialState,
        error: initialState,
        message: ""
    }
}

type InitType = {
    method: string
    headers: {
        'Content-Type': string
        'Authorization': string
    }
    body?: string
}

function reducer(state: ReducerStateType, action: ReducerActionType) {
    switch (action.type) {
        case "success":
            return {
                ...state,
                success: true,
                error: false,
                message: action.payload
            };
        case "error":
            return {
                ...state,
                success: false,
                error: true,
                message: action.payload
            };
        case "reset":
            return init(false);
        default:
            throw new Error();
    }
}


export const getIDs = (genres: string[], genres_list: Genres[]) => {
    const genresMap: GenresMap = {};
    genres.forEach((genre: string) => {
        const genre_ = genres_list.find((item: Genres) => item.name === genre);
        if (genre_) {
            genresMap[genre_.id] = genre_.name;
        }
    });
    return genresMap;
};


export const AddMovieForm = ({movie, genres_list}: { movie: MovieType | null, genres_list: Genres[] }) => {

    const router = useRouter();
    const context = React.useContext(store);
    const {data: session, status} = useSession();

    function transformDate(release_date: string): string {
        const date = release_date.split("T")[0].split("-");
        return `${date[0]}-${date[1]}-${date[2]}`;
    }

    const initialState = {
        title: movie ? movie.title : '',
        releaseDate: movie ? transformDate(movie.release_date) : '',
        runtime: movie ? movie.runtime : '',
        description: movie ? movie.description : '',
        rating: movie ? movie.rating : '',
    }
    const [title, setTitle] = React.useState(initialState.title);
    const [releaseDate, setReleaseDate] = React.useState(initialState.releaseDate);
    const [runtime, setRuntime] = React.useState(initialState.runtime);
    const [description, setDescription] = React.useState(initialState.description);
    const [rating, setRating] = React.useState(initialState.rating);
    const [errors, setErrors] = React.useState<Array<string>>([]);
    const [state, dispatch] = React.useReducer(reducer, false, init)


    useEffect(() => {
        let timeOutId: NodeJS.Timeout
        if (state.success) {
            timeOutId = setTimeout(async () => {
                await router.replace('/admin')
            }, 800)
        }
        if (state.error) {
            timeOutId = setTimeout(() => {
                dispatch({type: "reset", payload: ""})
            }, 3000)
        }
        return () => {
            clearTimeout(timeOutId)
        }

    }, [router, state])


    const requestToServer = (input: string, init: InitType) => {
        fetch(input, init).then(response => response.json())
            .then(data => {
                if (data?.status === 200) {
                    dispatch({type: 'success', payload: data.message})
                } else {
                    throw new Error(data.error)
                }

            }).catch(error => {
            dispatch({type: 'error', payload: error.message})
            console.log(error.message)
        })

    }

    const deleteMovieHandler = () => {
        if (movie) {
            const init = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.accessToken}`
                }
            }
            requestToServer(`${process.env.APP_API}/v1/admin/delete?id=${movie.id}`, init)
        }
    }

    const submitFormHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        //obtain the option of select element
        const mpaaRatingOption = document.querySelector("#mpaa") as HTMLSelectElement
        const mpaaRatingValue = mpaaRatingOption.options[mpaaRatingOption.selectedIndex].value
        //obtain the option of select element genres
        const genresOption = document.querySelector("#genres") as HTMLSelectElement
        const genresValue = Array.from(genresOption.selectedOptions).map(option => option.value)

        // const newForm = new FormData(event.target as HTMLFormElement)
        // console.log(Object.fromEntries(newForm.entries()))
        //TODO: validate the form, if it is valid, send the data to the server using an api call

        if (title.trim() === '' || title.trim().length > 50) {
            setErrors((previousValues) => {
                return [...previousValues, 'title']
            })
        }
        const payload: MovieType = {
            id: movie ? movie.id : 0, //zero is a new movie
            title: title.trim(),
            release_date: releaseDate + "T00:00:00Z",
            runtime: Number(runtime),
            description: description.trim(),
            rating: Number(rating),
            mpaa_rating: mpaaRatingValue,
            genres: getIDs(genresValue, genres_list)
        }
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        const postObject = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.accessToken}`
            },
            body: JSON.stringify(payload)
        }
        requestToServer(`${process.env.APP_API}/v1/admin/movie?id=${payload.id}`, postObject)

    }

    const titleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        //remove the error if it exists
        setErrors((previousValues) => {
            return previousValues.filter(value => value !== 'title')
        })
        setTitle(event.target.value)
    }
    const releaseDateHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReleaseDate(event.target.value)
    }
    const runtimeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRuntime(event.target.value)
    }
    const descriptionHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value)
    }

    const getGenres = () => {
        if (movie) {
            return Object.values(movie.genres!)
        }
        return []
    }

    const genres_options = genres_list.map(genre => {
        return <option key={genre.id} value={genre.name}>{genre.name}</option>
    })

    return (
        <form className={context.darkMode ? styles.form__darkMode : styles.form} onSubmit={submitFormHandler}>
            <label htmlFor="title">Title</label>
            <input type="text" id="title"
                   value={title}
                   name="title" onChange={titleHandler} maxLength={50}
                   minLength={2}
                   onFocus={() => setErrors((previousValues) => {
                       return previousValues.filter(value => value !== 'title')
                   })}
                   className={errors.includes('title') ? styles.error : ''}
                   required/>
            <label htmlFor="release">Release Date</label>
            <input type="date" id="release" value={releaseDate} onChange={releaseDateHandler} required min="1900-01-01"
                   max="2030-01-01"/>
            <label htmlFor="runtime">Runtime</label>
            <input type="number" id="runtime" min={1} step={1} value={runtime} onChange={runtimeHandler} required/>
            <label htmlFor="mpaa">MPAA Rating</label>
            <select id="mpaa" name="mpaa" required defaultValue={movie?.mpaa_rating}>
                <option value={MPAARating.G}>{MPAARating.G}</option>
                <option value={MPAARating.PG}>{MPAARating.PG}</option>
                <option value={MPAARating.PG13}>{MPAARating.PG13}</option>
                <option value={MPAARating.R}>{MPAARating.R}</option>
                <option value={MPAARating.NC17}>{MPAARating.NC17}</option>
            </select>
            <label htmlFor="rating">Rating
                <input id="rating"
                       type="number"
                       list="ratingList"
                       min={1}
                       max={5}
                       step={1}
                       defaultValue={rating}
                       onChange={(event) => {
                           const rating = event.target.value
                           setRating(rating)
                       }}
                       className={styles.rating} required/></label>
            <datalist id="ratingList">
                <option value="1"/>
                <option value="2"/>
                <option value="3"/>
                <option value="4"/>
                <option value="5"/>
            </datalist>

            <label htmlFor="genres" className={styles.genres}>Choose one or more genres
                <select id="genres" name="genres" multiple size={5} required defaultValue={getGenres()}>
                    {genres_options}
                </select>
            </label>

            <label htmlFor="description">Description</label>
            <textarea id="description" minLength={3} maxLength={800} required value={description}
                      onChange={descriptionHandler}/>


            {state.error ? <p className={styles["response__error"]}>{state.message}</p> :
                state.success ? <p className={styles["response__success"]}>{state.message}</p> :
                    <div className={styles.buttons}>
                        <button
                            type="submit"
                        >{"Submit"}
                        </button>
                        {movie && <>
                            <button
                                type="button"
                                onClick={() => router.back()}
                            >{"Cancel"}
                            </button>
                            <button
                                type="button"
                                onClick={deleteMovieHandler}
                                className={styles.delete}
                            >{"Delete"}
                            </button>
                        </>
                        }
                    </div>
            }
        </form>
    )

}
