"use client"
import { EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { passwordStrength } from 'check-password-strength'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import PassStrength from './PassStrength'
import Link from 'next/link'
import { resetPassword } from '../../lib/actions/authActions'
import { toast } from 'react-toastify'
import { Router } from 'next/router'
interface Props{
    encryptedId:string
}

const formSchema=z.object({
    password:z.string().min(6, "Password is too short!").max(45, 'Password is too long!'),
    confirmPassword:z.string().min(6, "Password is too short!").max(45, 'Password is too long!')
}).refine(data=>data.password===data.confirmPassword,{
    message:"Passwords do not match!",
    path:['confirmPassword']
})
type InputType=z.infer<typeof formSchema>

const ResetPass = ({encryptedId}:Props) => {
    const [visiblePass,setIsvisiblePass]=useState(false)
    const [passStrength,setPassStrength]=useState(0)
    const {register,handleSubmit, reset,watch, formState:{errors, isSubmitting}}=useForm<InputType>({
        resolver:zodResolver(formSchema)
    })
    useEffect(()=>{
        setPassStrength(passwordStrength(watch().password).id)
      },[watch])

    const resetPass:SubmitHandler<InputType> =async (data)=>{

        try{
            const result =await resetPassword(encryptedId,data.password)
            console.log(result)
        if(result==='success') {
            
            toast.success('Your password has been reset successfully!')
        }
    }
        catch(err){
            toast.error("Oops! something went wrong on our end!")
            console.log(err)
        }
    }
  return (
    <form onSubmit={()=>handleSubmit(resetPass)} className='flex flex-col gap-2 p-2 m-2 border rounded-md shadow'>
        <div className='text-center p-2'>Reset Your Password</div>
        <Input label="New Password"
        type={visiblePass?'text':'password'}
        {...register('password')}
        startContent={<KeyIcon className='w-4'/>}
        errorMessage={errors.password?.message}
        endContent={
            <span onClick={()=>setIsvisiblePass(prev=>!prev)}>{visiblePass?<EyeIcon className='w-4 cursor-pointer'/>:<EyeSlashIcon className='w-4 cursor-pointer'/>}</span>
            
        }/>
        <div className='w-14' >
        <PassStrength passStrength={passStrength}/>
        </div>
        
        <Input label="Confirm New password"
        type={visiblePass?'text':'password'}
        {...register('confirmPassword')}
        startContent={<KeyIcon className='w-4'/>}
        errorMessage={errors.confirmPassword?.message}
        />
        <div className='flex justify-center'>
        <Button color='primary' type='submit' disabled={isSubmitting} isLoading={isSubmitting}  >{isSubmitting?'Please wait...':"Submit"}</Button>
        </div>
    </form>
  )
}

export default ResetPass