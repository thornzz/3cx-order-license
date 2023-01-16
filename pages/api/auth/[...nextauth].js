import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../../firebase";

export const authOptions = {

    providers: [
        // ...add more providers here
        CredentialsProvider({

            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {label: "Username", type: "text", placeholder: "jsmith"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials, req) {
                try {
                    const data = await signInWithEmailAndPassword(auth, credentials?.username || '', credentials?.password || '')
                    
                    const user = {
                        email: data.user.email,
                        name:data.user.displayName

                    }
                    return ({
                        ...user
                    })

                } catch (error) {
                    return null
                }

            },
        }),
    ],

    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
};

export default NextAuth(authOptions);