import { Image, Link } from '@nextui-org/react'
import React from 'react'
import SignupForm from '../../components/SignupForm'


const SignupPage = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 place-items-center items-center'>
        <div className='md:col-span-2 flex justify-center items-center'>
        <p className='text-center p-2'>Already Signed up?</p>
        <Link href='/auth/signin'>Sign In</Link>
        </div>
        <SignupForm/>
        <Image src='/login.png' alt='Login From' width={500} height={500}/>
    </div>
  )
}

export default SignupPage