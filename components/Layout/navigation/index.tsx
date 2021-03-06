import Link from "next/link"
import styles from "./navigation.module.scss"
import {useContext, useEffect, useState} from "react";
import {store} from "../../Store";
import {Page} from "../../../Types";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

export const Navigation = () => {
    const {data: session, status} = useSession();
    const context = useContext(store)
    const [subMenu, setSubMenu] = useState(false)
    const [mountSubMenu, setMountSubMenu] = useState(false)
    // const router = useRouter()
    // const baseUrl = router.pathname.split('/')[1]
    // console.log(baseUrl)

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
            <Link href="/search">
                <a className={context.activePage == Page.GraphQL ? styles.active : ""}>Search</a>
            </Link>
        </li>

        {isAuthenticated &&<div className={styles["authenticated__menus"]}>
            <li>
                <Link href="/favorites">
                    <a className={context.activePage == Page.Fav ? styles.active : ""}>Favorites</a>
                </Link>
            </li>
            <li>
                <Link href="/admin">
                    <a
                        onMouseEnter={() => setSubMenu(true)}
                        onMouseLeave={() => setSubMenu(false)}
                        className={context.activePage == Page.Catalog ? styles.active : ""}>Edit</a>
                </Link>
                {(mountSubMenu || context.activePage == Page.Add) && subMenuJSX}
            </li></div>}

    </nav>
}