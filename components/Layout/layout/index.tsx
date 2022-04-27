import {ReactNode, useContext} from "react";
import {Navigation} from "../navigation";
import styles from "./Layout.module.scss"
import {Header} from "../../Header";
import {store} from "../../Store";

export const Layout = ({children}: { children: ReactNode }) => {
    const context = useContext(store)

    return <>
        <Header/>
        <div className={ context.darkMode ? styles.content__darkMode:styles.content }>
            <Navigation/>
            <div className={styles.children}>{children}</div>
        </div>
    </>
};