require('dotenv').config();
const { Router }=require("express");
const adminRouter=Router();

const jwt=require("jsonwebtoken");
const { JWT_ADMIN_SECRET }=process.env

const { adminModel }=require("../db");

adminRouter.post("/signup",async (req,res)=>{
    const{name,email,password}=req.body;
    await adminModel.create({
        name:name,
        email:email,
        password:password
    })
    res.json({
        message:"Admin Signed up"
    })
})

adminRouter.post("/signin",async (req,res)=>{
    const{email,password}=req.body;
    const adminFound=await adminModel.findOne({
        email:email,
        password:password
    })
    if(adminFound){
        const token=jwt.sign({
            id:adminFound._id
        },JWT_ADMIN_SECRET);
    res.json({
        message:"Admin Signed in",
        token:token
    })

    }else{
        
        res.status(402).json({
            message:"Admin Credentials Invalid"

        })
    }     
    
})
module.exports={
    adminRouter:adminRouter
}