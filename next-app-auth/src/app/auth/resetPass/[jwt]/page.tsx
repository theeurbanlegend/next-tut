import React from 'react'
import ResetPass from '../../../components/ResetPass'
import { verifyJWT } from '../../../../lib/jwt'

interface Props{
    params:{
        jwt:string
    }
}
const ActivationPage =({params}:Props) => {
  const payload =verifyJWT(params.jwt)
  if(!payload) return <div className='flex items-center justify-center  h-screen text-red-500 text-2xl'>The URL is not valid!</div>
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <ResetPass encryptedId={params.jwt}/>
    </div>
  )
}

export default ActivationPage