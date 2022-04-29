import styles from './LoadingPage.module.scss'
import React from "react";

export const LoadingPage = () => {
    return (
        <div className={styles["loading__container__page"]}>
            <h2>Loading...</h2>
        </div>
    )
}