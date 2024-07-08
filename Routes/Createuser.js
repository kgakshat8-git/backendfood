const express=require('express');
const router=express.Router()
//const {Router}=express
const User=require('../models/User');
const {body,validationResult}=require('express-validator')
const jwt=require("jsonwebtoken")
//const bcrypt=require("bcryptjs")


const jwtSecret="Hello its my first Mern Stack Project" //secret code
router.post('/createuser',[
    body('email').isEmail(),
    body('name','Name should have minimum 3 characters').isLength({min:3}),
    body('password','Password should have minimum 5 characters').isLength({min:5})
], async (req,res)=>{
    const errs = validationResult(req)
    if(!errs.isEmpty()){
        return res.status(404).json({errors:errs.array()});
    }
    try{
       await User.create({
            name:req.body.name,
            password:req.body.password,
            email:req.body.email,
            location:req.body.locat,
            date:req.body.date
        })
        res.json({ success: true} );

        }
    catch(err){
    console.log(err);
    res.json({success:false});
    }
})

router.post('/loginuser', async (req,res)=>{
   let email=req.body.email;
    try{
        let userData= await User.findOne({email});
        if(!userData)
            return res.status(404).json({errors:"Invalid Credentials"});
        
        if(!(req.body.password===userData.password))
            return res.status(404).json({errors:"Invalid Credentials"}); 
        
        const data={
            user:{
                id:userData.id
            }
        }
        const authToken=jwt.sign(data,jwtSecret)

        //console.log(userData)
        return res.json({success:true, authToken:authToken, mailid:userData.email, name1:userData.name});
        }     
    catch(err){
    console.log(err);
    res.json({success:false});
    }
})
module.exports=router