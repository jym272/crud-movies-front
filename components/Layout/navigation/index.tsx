import Link from "next/link"
import styles from "./navigation.module.scss"
import {useContext} from "react";
import {store} from "../../Store";
import {Page} from "../../../Types";

export const Navigation = () => {
    const context = useContext(store)
    return <nav className={styles.navigation}>
        <li>
            <Link href="/">
                <a className={context.activePage == Page.Home ? styles.active : ""}>Home</a>
            </Link>
        </li>
        <li>
            <Link href="/movies">
                <a className={context.activePage == Page.Movies ? styles.active : ""}>Movies</a>
            </Link>
        </li>
        <li>
            <Link href="/genres">
                <a className={context.activePage == Page.Genres ? styles.active : ""}>Genres</a>
            </Link>
        </li>
        <li>
            <Link href="/admin/movie/add">
                <a className={context.activePage == Page.Add ? styles.active : ""}>Add Movie</a>
            </Link>
        </li>
        <li>
            <Link href="/catalog">
                <a className={context.activePage == Page.Catalog ? styles.active : ""}>Catalog</a>
            </Link>
        </li>
    </nav>
}