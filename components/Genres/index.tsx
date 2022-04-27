import Link from "next/link";
import {Genres} from "../../Types";
import styles from "./Genres.module.scss"
import {useContext} from "react";
import {store} from "../Store";

export const GenresComponent = ({genres}: { genres: Genres[] }) => {


    const context = useContext(store)

    return <div className={ context.darkMode ? styles.genres__darkMode:styles.genres }>
        {genres.map((genre: Genres, index) => (
            <div key={index}>
                <Link href={`/genres/${genre.id}`} passHref>
                    <a>
                        {genre.name}
                    </a>
                </Link>
            </div>
        ))}
    </div>

}
