const jwt=require('jsonwebtoken')
require('dotenv').config()
const User=require('../models/userModel')
const verifyAdminToken=async (req,res,next)=>{
    const token=req.cookies.adminToken
    if(!token){

        return res.status(401).json({message:"Unauthorized,no token"})
    }
    try {
        const decoded=jwt.verify(token,process.env.TOKEN_KEY)
        //attaches user info to req object
      await User.findById(decoded.id).select('-password')
     
        next()
    } catch (error) {
        console.log("invalid token");
        
        return res.status(401).json({message:'Invalid token'})
    }
    
   
}

module.exports=verifyAdminToken