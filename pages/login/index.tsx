import {Login} from "../../components";
import {getSession} from "next-auth/react";
import {GetServerSideProps} from "next";

const LoginPage = () => {
    return <Login/>
}
export default LoginPage

export const getServerSideProps: GetServerSideProps = async (context) => {

    const session = await getSession(context)  //server side auth
    if (session) {
        return {
            redirect: {
                destination: '/movies',
                permanent: false,
            },
        }
    }
    return {
        props: {}
    }
}
