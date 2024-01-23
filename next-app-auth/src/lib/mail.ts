import Handlebars from 'handlebars';
import nodemailer from 'nodemailer'
import { activationTemplate } from './emailTemplates/activation';
import { resetPass } from './emailTemplates/resetPass';
export async function sendMail({to,subject,body}:{to:string,subject:string,body:string}){
    const {SMTP_EMAIL_USER,SMTP_PASS}=process.env
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: SMTP_EMAIL_USER,
          pass: SMTP_PASS
        }
      });
    try{
        const testRes=await transport.verify()
        console.log(testRes)
    }
    catch(err){
        console.log(err)
    }
    try{
        const testRes=await transport.sendMail({
            from:SMTP_EMAIL_USER,
            to,
            subject,
            html:body
        })
        console.log(testRes)
    }
    catch(err){
        console.log(err)
    }
}

export function compileActivationTemplate(name:string, url:string){
    const template =Handlebars.compile(activationTemplate)
    const htmlBody=template({
        name,url
    })
    return htmlBody
}
export function compileResetPassTemplate(name:string, url:string){
    const template =Handlebars.compile(resetPass)
    const htmlBody=template({
        name,url
    })
    return htmlBody
}