import {useRouter} from "next/router";
import React, {useContext, useEffect} from "react";
import {store} from "../Store";
import styles from "./Auth.module.scss"

const LoadingPage = () => {
    return (
        <div className={styles["loading__container__page"]}>
            <h1>Loading...</h1>
        </div>
    )
}

const Redirect = () => {
    const router = useRouter();

    useEffect(() => {
        // let timer: NodeJS.Timeout
        // timer = setTimeout(() => {
        //     router.push('/login')
        // }, 30)
        router.push("/login");
        // return () => clearTimeout(timer)
    }, [router]);

    return <LoadingPage/>;
};


export const Auth = ({children}: { children: JSX.Element }) => {
    const context = useContext(store)
    if (context.jwt === "") {
        return <Redirect/>;
    } else {
        return children
    }
}

