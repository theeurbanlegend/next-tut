"use server"

import { User } from "@prisma/client";
import prisma from "../prisma";
import * as bcrypt from 'bcrypt'
import { compileActivationTemplate, compileResetPassTemplate, sendMail } from "../mail";
import { signJWT, verifyJWT } from "../jwt";

export async function registerUser(user: Omit<User,"id"|"emailVerified"|"image">){
    const result = await prisma.user.create(
        {
            data:{
                ...user,
                password:await bcrypt.hash(user.password,10)
            },
        }
    )
    
    const encryptedId=signJWT({
        id:result.id
    })
    const activateURl=`${process.env.NEXTAUTH_URL}/auth/activation/${encryptedId}`
    const body= compileActivationTemplate(user.firstName,activateURl)
    await sendMail({to:user.email, subject:'Activate Your Account!',body})
    return result
}
type ActivateUserFunc=(encryptedId:string)=>Promise<"nonExistent"|"alreadyActive"|"activationSuccess">

export const activateUser:ActivateUserFunc=async (encryptedId)=>{
    const payload=verifyJWT(encryptedId)
    const userId=payload?.id
    const user =await prisma.user.findUnique({
        where:{
            id:userId
        }
    })
    if(!user) return "nonExistent"
    if(user.emailVerified) return "alreadyActive"
    const result =await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            emailVerified:new Date()
        }
    })
    return 'activationSuccess'
}

export async function forgotPassword(email:string){
    const user=await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if(!user) throw new Error("User doesn't exist!")
    const encryptedId=signJWT({
        id:user.id
    })
    const resetURl=`${process.env.NEXTAUTH_URL}/auth/resetPass/${encryptedId}`
    const body= compileResetPassTemplate(user.firstName,resetURl)
    await sendMail({to:user.email, subject:'Reset Your Password!',body})
    return user
}

type ResetPassowrdFn=(encryptedId:string,password:string)=>Promise<"userNonExist"|"success">

export const resetPassword:ResetPassowrdFn=async(encryptedId,password)=>{
    const payload=verifyJWT(encryptedId)
    if(!payload) return 'userNonExist'
    const userId=payload.id
    const user= await prisma.user.findUnique({
        where:{
            id:userId
        }
        
    })
    if(!user) return 'userNonExist'

    const result =await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            password:await bcrypt.hash(password,10)
        }
})
if(result) return 'success'
else throw new Error('Something went wrong!')

}