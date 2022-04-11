import {ReactNode} from "react";
import {Title} from "../../title";
import {Navigation} from "../navigation";
import styles from "../../../styles/Content.module.scss"

export const Layout = ({children}: { children: ReactNode }) => {
    return <>
        <Title/>
        <div className={styles.content}>
            <Navigation/>
            <div className={styles.children}>{children}</div>
        </div>
    </>
};