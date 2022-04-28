import {useRouter} from "next/router";
import React, {useContext, useEffect, useState} from "react";
import {store} from "../Store";
import styles from "./Auth.module.scss"
import {JWTType} from "../../Types";
import {useSession} from "next-auth/react";

const LoadingPage = () => {
    return (
        <div className={styles["loading__container__page"]}>
            <h2>Loading...</h2>
        </div>
    )
}
export const Auth = ({children}: { children: JSX.Element }) => {
    const router = useRouter();
    const {data: session, status} = useSession({
        required: true,
        onUnauthenticated() {
            // The user is not authenticated, handle it here.
            router.push("/login");
        },
    })
    const isUser = !!session?.user
    if (isUser) {
        return children
    }
    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    return <LoadingPage/>
}


// export const Auth = ({children, auth}: { children: JSX.Element, auth: boolean | undefined }) => {
//
//     const [isAuthorized, setIsAuthorized] = useState(false)
//     const [redirect, setRedirect] = useState(false)
//     const context = useContext(store)
//     const router = useRouter();
//
//     useEffect(() => {
//         if (context.jwt) {
//             setIsAuthorized(true)
//             return
//         }
//
//         const jwt = localStorage.getItem("jwt");
//         if (jwt) {
//             const item: JWTType = JSON.parse(jwt);
//             const now = new Date().getTime(); //get current time in milliseconds
//
//             if (now > item.expires) { //if token has expired
//                 localStorage.removeItem("jwt");
//                 setRedirect(true)
//             } else {
//                 setIsAuthorized(true)
//                 context.setJwt(item.jwt)
//             }
//         } else {
//             setRedirect(true)
//         }
//     }, [context])
//     if (isAuthorized) {
//         return children
//     }
//     if (redirect) {
//         if (auth) {
//             router.push("/login")
//         } else {
//             return children
//         }
//     }
//
//     return <LoadingPage/>
//
// }

