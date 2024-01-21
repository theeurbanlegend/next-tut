import Link from 'next/link'
import React from 'react'
import SignInForm from '../../components/SignInForm'
interface Props{
    searchParams:{
        callbackUrl?:string
    }
}
const SignInPage = ({searchParams}:Props) => {
  return (
    <div className='flex items-center justify-center flex-col'>
        <SignInForm callbackUrl={searchParams.callbackUrl}/>
        <Link href={"auth/forgotPass"}>Forgot your password?</Link>
    </div>
  )
}

export default SignInPage