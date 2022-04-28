import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import {JWTType} from "../../../../Types";


export default NextAuth({
    // secret: process.env.NEXT_AUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                const user = {
                    email: credentials?.email as string,
                    password: credentials?.password as string,
                }


                const response = await fetch(process.env.APP_API + '/v1/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                })
                const data = await response.json()

                return { // Return the user object to sigIn, the accesToken is added
                    email: user.email,
                    accessToken : data.jwt,
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],
    callbacks: { // in order!, for credentials authorize is called first
        async signIn({ user, account, profile, email, credentials }) {

            return account.provider === "google" || account.provider === "credentials";


            // const isAllowedToSignIn = true
            // if (isAllowedToSignIn) {
            //     return true
            // } else {
            //     // Return false to display a default error message
            //     return false
            //     // Or you can return a URL to redirect to:
            //     // return '/unauthorized'
            // }
        },
        async jwt({ token, account, user }) {
            // console.log("JWT", token)
            //The arguments user, account, profile and isNewUser are only passed the first time this callback is called
            // on a new session, after the user signs in. In subsequent calls, only token will be available.

            // Use an if branch to check for the existence of parameters (apart from token).
            // If they exist, this means that the callback is being invoked for the first
            // time (i.e. the user is being signed in). This is a good place to persist additional data
            // like an access_token in the JWT. Subsequent invocations will only contain the token parameter.
            if (account && user) {

                if(account.provider === "credentials"){
                    token.accessToken = user.accessToken
                }

                if(account.provider === "google" ){
                    console.log(user) //obtain info from user object for the backend
                    const user_ = { //este user existe en el backend
                        email: "jym272@gmail.com",
                        password: "password",
                    }
                    //busco el token en el backend, si es un usuario nuevo, lo creo

                    const response = await fetch(process.env.APP_API + '/v1/signin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(user_)
                    })
                    const data = await response.json()
                    token.accessToken = data.jwt
                }
            }
            return token
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            // The access token is always forwarded to the client through the session object.
            session.accessToken = token.accessToken
            return session
        }
    }
});