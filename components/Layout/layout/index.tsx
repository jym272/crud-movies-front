import {ReactNode} from "react";
import {Navigation} from "../navigation";
import styles from "./Layout.module.scss"
import {Header} from "../../Header";

export const Layout = ({children}: { children: ReactNode }) => {
    return <>
        <Header/>
        <div className={styles.content}>
            <Navigation/>
            <div className={styles.children}>{children}</div>
        </div>
    </>
};