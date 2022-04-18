import {useRouter} from "next/router";
import React, {useContext, useEffect, useState} from "react";
import {store} from "../Store";
import styles from "./Auth.module.scss"
import {JWTType} from "../../Types";

const LoadingPage = () => {
    return (
        <div className={styles["loading__container__page"]}>
            <h1>Loading...</h1>
        </div>
    )
}

export const Auth = ({children, auth}: { children: JSX.Element, auth: boolean | undefined }) => {

    const [isAuthorized, setIsAuthorized] = useState(false)
    const [redirect, setRedirect] = useState(false)
    const context = useContext(store)
    const router = useRouter();

    useEffect(() => {
        if (context.jwt) {
            setIsAuthorized(true)
            return
        }

        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            const item: JWTType = JSON.parse(jwt);
            const now = new Date().getTime(); //get current time in milliseconds

            if (now > item.expires) { //if token has expired
                localStorage.removeItem("jwt");
                setRedirect(true)
            } else {
                setIsAuthorized(true)
                context.setJwt(item.jwt)
            }
        } else {
            setRedirect(true)
        }
    }, [context])
    if (isAuthorized) {
        return children
    }
    if (redirect) {
        if (auth) {
            router.push("/login")
        } else {
            return children
        }
    }

    return <LoadingPage/>

}

