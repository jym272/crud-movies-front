import styles from './Login.module.scss';
import React, {useContext, useEffect} from "react";
import {store} from "../Store";
import {useRouter} from "next/router";
import {JWTType} from "../../Types";

type InputErrors = {
    email: string,
    password: string
}


export const Login = () => {
    const Errors: InputErrors = {
        email: "",
        password: "",
    };

    const context = useContext(store)
    const router = useRouter()
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState<InputErrors>(Errors);

    useEffect(() => {
        // Prefetch the movies page
        router.prefetch('/movies')
    }, [router])


    const loginSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //validation
        const input = {
            email: email.trim(),
            password: password.trim(),
            errors: false,
        }
        //if email doesn't contain @
        if (!input.email.includes('@')) {
            setErrors((prevState) => {
                return {
                    ...prevState,
                    email: "Email must contain @"
                }
            })
            input.errors = true;
        }
        if (input.password.length < 8) {
            setErrors((prevState) => {
                return {
                    ...prevState,
                    password: "Password must be at least 8 characters"
                }
            })
            input.errors = true;
        }
        if (input.errors) {
            return;
        }
        const user = {
            email: input.email,
            password: input.password,
        }
        fetch(process.env.APP_API + '/v1/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    const msg = data.error as string;
                    setErrors((prevState) => {
                        return {
                            ...prevState,
                            email: msg.includes("user") ? msg : prevState.email,
                            password: msg.includes("password") ? msg : prevState.password,
                        }
                    })
                } else {
                    context.setJwt(data.jwt);
                    //jwt to local storage for 72 hours (72 * 60 * 60 * 1000) in milliseconds
                    const item: JWTType = {
                        jwt: data.jwt,
                        expires: new Date().getTime() + (72 * 60 * 60 * 1000) //72 hours in milliseconds
                    }
                    localStorage.setItem('jwt', JSON.stringify(item));
                    router.push('/movies');
                }
            })
            .catch(err => console.log(err));
    }

    return <div className={styles["form__container"]}>
        <form onSubmit={loginSubmitHandler}>
            <h1>Login</h1>
            <div>
                <label htmlFor="InputEmail">Email address:</label>
                <input
                    required
                    className={errors.email != "" ? styles["input__error"] : ""}
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value)
                        setErrors((prevState) => {
                            return {
                                ...prevState,
                                email: ""
                            }
                        })
                    }}
                    type="text"
                    id="InputEmail" aria-describedby="emailHelp"
                    placeholder="Enter email"/>
                {errors.email != "" &&
                    <div className={styles["input__error__msg"]}>{errors.email}</div>}
            </div>

            <div>
                <label htmlFor="InputPassword">Password:</label>
                <input
                    required
                    className={errors.password != "" ? styles["input__error"] : ""}
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value)
                        setErrors((prevState) => {
                            return {
                                ...prevState,
                                password: ""
                            }
                        })
                    }}
                    type="password"
                    id="InputPassword" placeholder="Password"/>
                {errors.password != "" &&
                    <div className={styles["input__error__msg"]}>{errors.password}</div>}
            </div>

            <button type="submit">Submit</button>
        </form>
    </div>
};
