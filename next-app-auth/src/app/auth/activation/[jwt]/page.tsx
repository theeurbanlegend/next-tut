import React from 'react'
import { activateUser } from '../../../../lib/actions/authActions'
interface Props{
    params:{
        jwt:string
    }
}
const ActivationPage = async({params}:Props) => {
  const result= await activateUser(params.jwt)
  return (
    <div className='h-screen flex flex-col items-center justify-center'>

      {result==="nonExistent"?
      <p className='text-red-500 text-2xl'>Oops! We could not find you!</p>
      :result==="alreadyActive"?
      <p className='text-red-500 text-2xl'>Do not worry! We already know you!</p>
      :result==="activationSuccess"?
      <p className='text-green-500 text-2xl'>Yippee!You are now activated!</p>
      :<p className='text-yellow-500 text-2xl'>Oops! Something went wrong!</p>}
    </div>
  )
}

export default ActivationPage