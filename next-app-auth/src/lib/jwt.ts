import jwt,{ JwtPayload } from "jsonwebtoken";
interface SignOption{
    expiresIn:string|number
}
const DEFAULT_SIGN_OPTION:SignOption={
    expiresIn:"1d"
}
export function signJWT(payload:JwtPayload,option:SignOption=DEFAULT_SIGN_OPTION){
    const secretKey=process.env.JWT_SECRET_KEY!
    const token=jwt.sign(payload,secretKey)
    return token
}
export function verifyJWT(token:string){
    try{
        const secretKey=process.env.JWT_SECRET_KEY!
    const decoded=jwt.verify(token,secretKey)
    return decoded as JwtPayload
}
    catch(err){
        console.log(err)
        return null
    }
}