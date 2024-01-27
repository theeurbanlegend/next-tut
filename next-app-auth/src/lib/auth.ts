import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'
import NextAuth from "next-auth/next";
import { User } from "@prisma/client";
import prisma from "./prisma";

export const authOptions: AuthOptions={
    pages:{
        signIn:'/auth/signin'
    },
    session:{
        strategy:'jwt'
    },
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
                if(!user.emailVerified){
                    throw new Error("Please verify your email first!")
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
