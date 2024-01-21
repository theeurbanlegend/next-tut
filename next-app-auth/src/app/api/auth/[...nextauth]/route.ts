
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'
import NextAuth from "next-auth/next";
import prisma from "../../../../lib/prisma";
import { User } from "@prisma/client";

export const authOptions: AuthOptions={
    providers:[
        CredentialsProvider({
            name:'Credentials',
            credentials:{
                username:{
                    label:"User Name",
                    type:"text",
                    placeholder:"Your email"
                },
                password:{
                    label:"Password",
                    type:"password"
                }
            },
            async authorize(credentials){
                const user =await prisma.user.findUnique({
                    where:{
                        email:credentials.username
                    }
                })
                if(!user){
                    throw new Error("User name or password is not correct!")
                }
                
                if (!credentials?.password){
                    throw new Error("Please input a password!")
                }
                const isPassCorrect= await bcrypt.compare(credentials.password, user.password)
                if(!isPassCorrect){
                    throw new Error("Password Incorrect!")
                }
                const {password, ...userWithoutPass}=user
                return userWithoutPass
            }
        })
    ]
    ,
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.user=user as User
            }
            return token
        },
        async session({token,session}){
            session.user=token.user
            return session
        }
    }
}
const handler=NextAuth(authOptions)

export {handler as GET, handler as POST}
