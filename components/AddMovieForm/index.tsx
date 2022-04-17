import styles from "./AddMovieForm.module.scss"
import React, {useEffect} from "react";
import {MovieType, MPAARating} from "../../Types";
import {getIDs} from "../../utils";
import {useRouter} from "next/router";

export const AddMovieForm = ({movie}: { movie: MovieType | null }) => {

    const router = useRouter();

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
    //TODO: crear un dispathac para loading, error, success

    const [success, setSuccess] = React.useState({
        status: false,
        message: ''
    });

    useEffect(() => {
        let timeOutId: NodeJS.Timeout
        if (success.status) {
            timeOutId = setTimeout(async () => {
                await router.replace('/catalog')
            }, 800)
        }
        return () => {
            clearTimeout(timeOutId)
        }

    }, [router, success])


    const deleteMovieHandler = () => {
        if (movie) {
            fetch(`http://localhost:8080/v1/admin/delete?id=${movie.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status === 200) {
                    setSuccess({
                        status: true,
                        message: 'Movie deleted'
                    })
                }
            })
            //TODO: manejo completo de errores de server
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
            genres: getIDs(genresValue)
        }
        const postObject = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
        //TODO: the response can be better handled, with a status, error, loading, etc...
        // a loading bar will be awesome
        fetch(`http://localhost:8080/v1/admin/movie?id=${payload.id}`, postObject)
            .then(response => response.json())
            .then(data => {
                if (data?.status === 200) {
                    setSuccess({
                        status: true,
                        message: data.message
                    })
                } else {
                    throw new Error(data.error)
                }

            }).catch(error => console.log(error))
        //redirect to home, replace history
        // router.replace('/').then(r => console.log(r))

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
            return Object.values(movie.genres)
        }
        return []
    }

    return (
        <form className={styles.form} onSubmit={submitFormHandler}>
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
                    <option value="Drama">Drama</option>
                    <option value="Action">Action</option>
                    <option value="Crime">Crime</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Comic Book">Comic Book</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Romance">Romance</option>
                </select>
            </label>

            <label htmlFor="description">Description</label>
            <textarea id="description" minLength={3} maxLength={800} required value={description}
                      onChange={descriptionHandler}/>


            {success.status ? <p className={styles.success}>{success.message}</p> :
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