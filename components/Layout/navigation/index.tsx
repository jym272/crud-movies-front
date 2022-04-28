import Link from "next/link"
import styles from "./navigation.module.scss"
import {useContext, useEffect, useState} from "react";
import {store} from "../../Store";
import {Page} from "../../../Types";
import {useSession} from "next-auth/react";

export const Navigation = () => {
    const {data: session, status} = useSession();
    const context = useContext(store)
    const [subMenu, setSubMenu] = useState(false)
    const [mountSubMenu, setMountSubMenu] = useState(false)
    useEffect(() => {
        let timer: NodeJS.Timeout
        if (!subMenu) {
            timer = setTimeout(() => {
                setMountSubMenu(false)
            }, 300)
        } else {
            setMountSubMenu(true)
        }
        return () => {
            clearTimeout(timer)
        }


    }, [subMenu])
    const isAuthenticated = !!session?.user


    const subMenuJSX = <Link href="/admin/movie/add">
        <a
            onMouseEnter={() => setSubMenu(true)}
            onMouseLeave={() => setSubMenu(false)}
            className={context.activePage == Page.Add ? styles["subMenu__active"] : styles.subMenu}>
            Add Movie
        </a>
    </Link>


    return <nav className={ context.darkMode ? styles.navigation__darkMode:styles.navigation }>
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
            <Link href="/about">
                <a className={context.activePage == Page.About ? styles.active : ""}>About</a>
            </Link>
        </li>
        <li>
            <Link href="/genres">
                <a className={context.activePage == Page.Genres ? styles.active : ""}>Genres</a>
            </Link>
        </li>
        <li>
            <Link href="/graphql">
                <a className={context.activePage == Page.GraphQL ? styles.active : ""}>GraphQL</a>
            </Link>
        </li>

        {isAuthenticated &&
            <li>
                <Link href="/admin">
                    <a
                        onMouseEnter={() => setSubMenu(true)}
                        onMouseLeave={() => setSubMenu(false)}
                        className={context.activePage == Page.Catalog ? styles.active : ""}>Edit</a>
                </Link>
                {(mountSubMenu || context.activePage == Page.Add) && subMenuJSX}
            </li>}

    </nav>
}