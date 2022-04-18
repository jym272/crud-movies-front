import styles from './Header.module.scss';
import {store} from "../Store";
import {useContext} from "react";
import {useRouter} from "next/router";

export const Header = () => {
    const context = useContext(store);
    const router = useRouter()
    const loginHandler = async () => {
        await router.push('/login')
    };
    const logoutHandler = async () => {
        context.setJwt("")
        //delete from localstorage with key jwt
        localStorage.removeItem("jwt")
        await router.push('/login')
    };

    return <div className={styles.title}>
        <div className={styles.header}>
            <div>
                Go watch some movies!
            </div>
            {context.jwt ?
                <div className={styles.login} onClick={logoutHandler}>
                    Logout
                </div> : <div className={styles.login} onClick={loginHandler}>
                    Login
                </div>}
        </div>
        <div className={styles.line}/>
    </div>
}