import styles from './About.module.scss'
import {store} from "../Store";
import {useContext} from "react";

export const AboutComponent =()=>{

    const context = useContext(store)
    return(
        <div className={ context.darkMode ? styles.about__darkMode:styles.about }>
            <h1>About</h1>
            <p>This is a CRUD app v1.0.0. Written by Jorge Clavijo. Email: jym272@gmail.com.</p>
            <div>Frontend: React ( NextJS Framework )</div>
            <p>Backend: Written in Go, implements a REST and GraphQL API&apos;s</p>
            <div>Database: PostgreSQL</div>
            <p>Web Server: Caddy &nbsp; / &nbsp;Server: Google Cloud VM instance</p>

        </div>
    )
}