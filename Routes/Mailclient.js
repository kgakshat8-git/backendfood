const nodemailer = require("nodemailer");
const express=require('express')
const router = express.Router()
const dotenv=require('dotenv')
dotenv.config()
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});
  router.post('/mailing',async(req,res)=>{
    const {mail,name}= await req.body;

    var mailOption ={
        from:process.env.SMTP_MAIL,
        to:mail,
        subject:"This is a confirmation email from EATINDIA",
        html:`<p> Hi ${name}, </p> <p>Thank You for choosing EatIndia. Your Order has been Placed.<br/> If you did not place this order, kindly report it to the sender's email address</p>`
    }

    transporter.sendMail(mailOption, function(err){
        if(err) console.log(err)
            else{
        console.log("Mail sent successfully")
        return}
    })


  })
  module.exports=router

