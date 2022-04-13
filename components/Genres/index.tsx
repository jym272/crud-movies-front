import Link from "next/link";
import {Genres} from "../../Types";
import styles from "./Genres.module.scss"

export const GenresComponent = ({genres}: { genres: Genres[] }) => {


    return <div className={styles.genres}>
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
