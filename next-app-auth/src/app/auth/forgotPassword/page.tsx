"use client"
import { EnvelopeIcon } from '@heroicons/react/24/solid'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import Image from 'next/image'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { forgotPassword } from '../../../lib/actions/authActions'
import { toast } from 'react-toastify'


const formSchema= z.object({
    email:z.string().email('Please enter a valid email!')
})
type InputType=z.infer<typeof formSchema>

const forgotPass = () => {
    const {register, handleSubmit,reset, formState:{errors, isSubmitting}}=useForm<InputType>({
        resolver:zodResolver(formSchema)
    })
    const submitRequest:SubmitHandler<InputType> =async(data)=>{
    try{
        const result=await forgotPassword(data.email)
        if(result) toast.success('Reset password Link was sent to your email')
        reset()
    }
    catch(err){
        console.log(err)
        toast.error('Oops! Something is wrong on our end!')
    }
    }
  return (
    <div className='grid grid-cols-1 md:grid-cols-3'>
        <form className='flex flex-col gap-2 p-2 border rounded-md shadow items-center' onSubmit={handleSubmit(submitRequest)}>
            <div className='text-center p-2'>Enter Your Email</div>
            <Input label='Email' {...register('email')}
            startContent={<EnvelopeIcon className='w-4'/>}
            errorMessage={errors.email?.message}

            /> 
            <Button isLoading={isSubmitting} disabled={isSubmitting} type='submit' color='primary'>{isSubmitting?'Please Wait....':'Submit'}</Button>
        </form>
        <Image src={'/forgotPass.png'} alt='Forgot Password' width={500} height={500} className='col-span-2 place-self-center'/>
    </div>
  )
}

export default forgotPass