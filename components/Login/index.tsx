import styles from './Login.module.scss';
import React from "react";

type inputErrors = {
    email: string,
    password: string
}

export const Login = () => {
    const Errors = {
        email: [],
        password: [],
    };


    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState<Array<string>>([]);

    const loginSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //validation
        const input = {
            email: email.trim(),
            password: password.trim()
        }
        //if email doesn't contain @
        if (!input.email.includes('@')) {
            setErrors(['Email must contain @']);
            return;
        }

        if (!input.email || !input.password) {
            setErrors((prevState) => {
                return [...prevState, 'password', "email"]
            })
            return;
        }
        console.log('Login submit');
    }

    return <div className={styles["form__container"]}>
        <form onSubmit={loginSubmitHandler}>
            <h1>Login</h1>
            <div>
                <label htmlFor="InputEmail">Email address:</label>
                <input
                    required
                    className={errors.includes('email') ? styles["input__error"] : ""}
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value)
                        setErrors(prevState => prevState.filter(error => error !== 'email'))
                    }}
                    type="email"
                    id="InputEmail" aria-describedby="emailHelp"
                    placeholder="Enter email"/>
            </div>
            <div>
                <label htmlFor="InputPassword">Password:</label>
                <input
                    required
                    className={errors.includes('password') ? styles["input__error"] : ""}
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value)
                        setErrors(prevState => prevState.filter(error => error !== 'password'))
                    }}
                    type="password"
                    id="InputPassword" placeholder="Password"/>
            </div>

            <button type="submit">Submit</button>
        </form>
    </div>
};
