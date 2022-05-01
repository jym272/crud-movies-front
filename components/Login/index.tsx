import styles from './Login.module.scss';
import React, {useContext, useEffect} from "react";
import {store} from "../Store";
import {useRouter} from "next/router";
import {signIn} from "next-auth/react";
import Image from "next/image";
import {isEmail} from "../../utils";

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
    const [signUp, setSignUp] = React.useState(false);
    const [loginAnimationStyle, setLoginAnimationStyle] = React.useState(styles.line__without__animation);
    const [eyeToggle, setEyeToggle] = React.useState(false);
    const [newUserCreated, setNewUserCreated] = React.useState(false);

    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);
    const submitButtonRef = React.useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // Prefetch the movies page
        router.prefetch('/movies')
    }, [router])

    useEffect(() => {
        if (errors.email || errors.password) {
            submitButtonRef.current?.classList.add(styles.button__disabled)
        } else {
            submitButtonRef.current?.classList.remove(styles.button__disabled)
        }
    }, [errors])

    useEffect(() => {
        let timer:NodeJS.Timer;
        if(newUserCreated){
            timer = setTimeout(() => {
                setNewUserCreated(false)
            }, 3000)
        }
        return () => clearTimeout(timer)

    }, [newUserCreated])


    const signUpUser = (user: { email: string, password: string }) => {
        fetch(process.env.APP_API + '/v1/signup', {
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
                    setNewUserCreated(true)
                    setSignUp(false)
                    console.log(data)
                    setEmail(data.email)

                }
            })
            .catch(err => console.log(err));

    }

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
        if (!isEmail(input.email)) {
            setErrors((prevState) => {
                return {
                    ...prevState,
                    email: 'Invalid email address'
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
        if (signUp) {
            signUpUser(user);
        } else {
            loginUser(user);
        }

    }


    const googleSubmitHandler = async () => {
        setEmail('');
        setPassword('');
        signIn('google', {callbackUrl: '/movies'})
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })

    }
    useEffect(() => {
        if (!newUserCreated) {
            setEmail('');
        }
        setPassword('');
        setEyeToggle(false);
        setErrors((prevState) => {
            return {
                ...prevState,
                email: "",
                password: ""
            }
        })
        passwordRef.current!.type = 'password';
        if (signUp) {
            if (emailRef.current) {
                emailRef.current.setAttribute('autocomplete', 'off');
                // emailRef.current.setAttribute('readonly', 'true');
                emailRef.current.value = ""; //if new user is created, the email is empty for sign up
            }
            if (passwordRef.current) {
                passwordRef.current.setAttribute('autocomplete', 'new-password');
                // passwordRef.current.setAttribute('readonly', 'true');
                // passwordRef.current.value = "";
            }
        } else {
            if (emailRef.current) {
                emailRef.current.setAttribute('autocomplete', 'on');
            }
            if (passwordRef.current) {
                passwordRef.current.setAttribute('autocomplete', 'current-password');
            }
        }
    }, [signUp])//dont add newUserCreated to dependency array


    const signUpHandler = () => {
        setLoginAnimationStyle(styles.line)
        setSignUp(true);
    }


    const showPasswordToggleHandler = () => {
        passwordRef.current!.type = passwordRef.current!.type === 'text' ? 'password' : 'text';
        setEyeToggle(!eyeToggle);
    }

    return <div className={context.darkMode ? styles["form__container__darkMode"] : styles["form__container"]}>
        <form onSubmit={loginSubmitHandler}>
            <div className={styles.header}>
                <h1 className={signUp ? styles.blur : ""} onClick={setSignUp.bind(this, false)}>Login</h1>
                <h1 className={signUp ? "" : styles.blur} onClick={signUpHandler}>Sign Up</h1>
                {newUserCreated && <div className={styles["new__user"]}>new user created</div>}

            </div>
            <div className={signUp ? styles["line__signUp"] : loginAnimationStyle}>
                {}
            </div>

            <div>
                <label htmlFor="InputEmail">Email address:</label>
                <input
                    ref={emailRef}
                    autoComplete='email'
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
                    <div className={errors.email.length > 53 ? styles["input__error__msg__relative"] :
                        styles["input__error__msg"]}>{errors.email}</div>}
            </div>

            <div>
                <label htmlFor="InputPassword">Password:</label>
                <div className={styles.password}>
                    <input
                        name="password"
                        ref={passwordRef}
                        autoComplete='current-password'
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
                        id="InputPassword" placeholder="*****"/>
                    <div className={styles["image__container"]} onClick={showPasswordToggleHandler}>


                        {eyeToggle ?
                            <Image
                                src="/images/login/eye-horus.svg"
                                alt="google logo"
                                width={35}
                                height={29}
                                priority={true}
                            /> :
                            <Image
                                src="/images/login/eye-closed.svg"
                                alt="google logo"
                                width={35}
                                height={29}
                                priority={true}
                            />
                        }

                    </div>
                </div>
                {errors.password != "" &&
                    <div className={errors.password.length > 53 ? styles["input__error__msg__relative"] :
                        styles["input__error__msg"]}>{errors.password}</div>}
            </div>

            <button ref={submitButtonRef} type="submit">{signUp ? "Submit" : "Login"}</button>

            <div className={styles.google} onClick={googleSubmitHandler}>
                <div className={styles.google__image}>
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
