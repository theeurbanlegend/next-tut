"use client"
import { Button, Checkbox, Input,Link } from '@nextui-org/react'
import {EnvelopeIcon, EyeIcon, EyeSlashIcon, KeyIcon, PhoneIcon, UserIcon} from '@heroicons/react/24/solid'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import validator from 'validator'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { passwordStrength } from 'check-password-strength'
import PassStrength from './PassStrength'
import { registerUser } from '../../lib/actions/authActions'
import { toast } from 'react-toastify'
const formSchema=z.object({
  firstName:z.string().min(2, "First name should not be less than 2 chars").max(45, "First name is too long, should be less than 45 chars").regex(new RegExp("^[a-zA-Z]+$"),"No Special Character Allowed!"),
  lastName:z.string().min(2, "Last name should not be less than 2 chars").max(45, "Last name is too long, should be less than 45 chars").regex(new RegExp("^[a-zA-Z]+$"),"No Special Character Allowed!"),
  email:z.string().email("Please enter a valid email address!"),
  phone:z.string().refine(validator.isMobilePhone,'Please enter a valid phone number!'),
  password:z.string().min(6, "Password must be at least 6 chars!").max(50,"Password is too long!"),
  confirmPassword:z.string().min(6, "Password must be at least 6 chars!").max(50,"Password is too long!"),
  accepted:z.literal(true,{
    errorMap:()=>({
      message:"Please accept all terms!"
    })
  })
}).refine(data=>data.password===data.confirmPassword,{
  message:"Passwords dont match!",
  path:["password", "confirmPassword"]
})
//Deflagged optinal type from InputType
type InputType = Required<z.infer<typeof formSchema>>;

const SignupForm = () => {
  const {register, handleSubmit, reset,control, formState:{errors},watch}=useForm<InputType>({
    resolver: zodResolver(formSchema)
  })
  const [visiblePass,setisVisiblePass]=useState(false)
  const [passStrength, setpassStrength]=useState(0)
  const toggleVisible=()=>setisVisiblePass(prev=>!prev)
  const saveUser:SubmitHandler<InputType> =async (data)=>{
    
    const {accepted, confirmPassword, ...user}=data
    
    try{
      const result=await registerUser(user)
      toast.success("User Registered Successfully!")
    }
    catch(err){
      toast.error("Oops, Something went wrong!")
      console.log(err)
    }
  }
  useEffect(()=>{
    setpassStrength(passwordStrength(watch().password).id)
  },[watch])
  return (
    <form onSubmit={handleSubmit(saveUser)} className='grid grid-cols-2 gap-3 p-2 place-self-stretch shadow border rounded-md'>
      <Input
       errorMessage={errors.firstName?.message} 
       {...register('firstName')}
        label="First name" 
        startContent={<UserIcon className='w-4 '/>}/>
      <Input 
      errorMessage={errors.lastName?.message}
       {...register("lastName")}
         label="Last name"
          startContent={<UserIcon className='w-4 '/>}/>
      <Input 
      errorMessage={errors.email?.message}
      {...register('email')}
        className='col-span-2' 
        label="Email" 
        type='email'
         startContent={<EnvelopeIcon  className='w-4 '/>}/>
      <Input 
      errorMessage={errors.phone?.message}
      {...register('phone')} 
       className='col-span-2' type='tel' label="Phone" 
       startContent={<PhoneIcon className='w-4  '/>}/>
      <Input
      errorMessage={errors.password?.message}
       {...register('password')}  className='col-span-2' type={visiblePass?'text':'password'} label="Password"
        startContent={<KeyIcon className='w-4' 
      />}
      endContent={
        visiblePass?<EyeIcon className='w-4 cursor-pointer' onClick={toggleVisible}/>:<EyeSlashIcon className='w-4 cursor-pointer' onClick={toggleVisible}/>
      }
      />
      <PassStrength passStrength={passStrength}/>
      <Input
       errorMessage={errors.confirmPassword?.message} {...register('confirmPassword')}
         className='col-span-2'
          type={visiblePass?'text':'password'} label="Confirm Password"
           startContent={<KeyIcon className='w-4  '/>}/>
      <Controller control={control} name='accepted' render={({field})=>(
        <Checkbox onChange={field.onChange} onBlur={field.onBlur}>I accept the <Link href='#'>Terms</Link></Checkbox>
      )}/>
      {errors.accepted&& <p className='text-red-500'>{errors.accepted.message}</p>}
      <div className='flex justify-center col-span-2'>
      <Button color='primary' type='submit'>Submit</Button>
      </div>
      
    </form>
  )
}

export default SignupForm