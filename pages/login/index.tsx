import {Login, store} from "../../components";
import {useContext, useState} from "react";

const LoginPage = () => {
    const context = useContext(store);
    // const [redirect, setRedirect] = useState(false);
    if (context.jwt) {
        return <div>You are already logged in</div>
    }
    return <Login/>
    //TODO: login page doesnt have to be invoked when the user is already logged in

}
export default LoginPage