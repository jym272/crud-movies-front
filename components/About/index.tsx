import styles from './About.module.scss'
import {store} from "../Store";
import {useContext} from "react";

export const AboutComponent = () => {

    const context = useContext(store)
    return (
        <div className={context.darkMode ? styles.about__darkMode : styles.about}>
            <h1>About</h1>
            <p>This is a CRUD app v1.0.0. Written by Jorge Clavijo. Email: jym272@gmail.com.</p>
            <div>Frontend: React ( NextJS Framework )</div>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/jym272/crud-movies-front">Repository</a>
            <p>Database: PostgreSQL</p>

            <div>Backend: Written in Go, implements a REST and GraphQL API&apos;s</div>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/jym272/crud-movies-back">Repository</a>


            <p>Web Server: Caddy &nbsp; / &nbsp;Server: Google Cloud VM instance</p>

        </div>
    )
}