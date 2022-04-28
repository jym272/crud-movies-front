import {Login} from "../../components";
import {useSession} from "next-auth/react";

const LoginPage = () => {
    const {data: session, status} = useSession()
    const isAuthenticated = !!session?.user
    if (isAuthenticated) {
        return <div>You are already logged in</div>
    }
    return <Login/>

}
export default LoginPage