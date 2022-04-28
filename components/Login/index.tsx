import styles from './Login.module.scss';
import React, {useContext, useEffect} from "react";
import {store} from "../Store";
import {useRouter} from "next/router";
import {signIn} from "next-auth/react";
import Image from "next/image";

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


    const loginUser = (user: { email: string, password: string }) => {
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
                    // if there is no errors means that the user exists in DB
                    // now the jwt token is persists in the session token through the next-auth
                    signIn<"credentials">("credentials", {
                        email,
                        password,
                        redirect: false,
                    }).then(response => {
                        if (response!.error) { //There should be no error, the user exists in DB
                            const msg = response!.error as string || "Something went wrong";
                            setErrors((prevState) => {
                                return {
                                    ...prevState,
                                    email: msg,
                                    password: msg,
                                }
                            })
                            return
                        }
                        router.push('/movies')
                    })
                }
            })
            .catch(err => console.log(err));

    }

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
        loginUser(user);
    }


    const googleSubmitHandler = async () => {
        signIn('google', {callbackUrl: '/movies'})
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })

    }

    return <div className={context.darkMode ? styles["form__container__darkMode"] : styles["form__container"]}>
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

            <div className={styles.guest} onClick={googleSubmitHandler}>
                <div className={styles.guest__image}>
                    <Image
                        src="/images/google_logo.png"
                        alt="google logo"
                        width={24}
                        height={24}
                        priority={true}
                    />
                </div>
                &nbsp;Log in with Google
            </div>
        </form>
    </div>
};
