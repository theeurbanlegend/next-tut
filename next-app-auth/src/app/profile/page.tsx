import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { Image } from "@nextui-org/react"
import { redirect } from "next/navigation"


const ProfilePage =async () => {
   const session=await getServerSession(authOptions)
   const user=session?.user
  return (
    <div>
        <Image height={300} width={300} src={user?.image??""} alt={user?.firstName??''}
        className='rounded-full'
        />
        <div className="grid gris-cols-4 gap-y-4">
            <p> FirstName:</p><p className='col-span-3'>{user?.firstName}</p>
            <p> Last Name:</p><p className='col-span-3'>{user?.lastName}</p>
            <p> Phone:</p><p className='col-span-3'>{user?.phone}</p>
            <p> Email:</p><p className='col-span-3'>{user?.email}</p>
        </div>
    </div>
  )
}

export default ProfilePage