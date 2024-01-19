import prisma from "@/lib/prisma";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'
import NextAuth from "next-auth/next";

export const authOptions: AuthOptions={
    providers:[
        CredentialsProvider({
            name:'Credentials',
            credentials:{
                username:{
                    label:"User Name",
                    type:"text",
                    placeholder:"Your User name"
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
}
const handler=NextAuth(authOptions)

export {handler as GET, handler as POST}
