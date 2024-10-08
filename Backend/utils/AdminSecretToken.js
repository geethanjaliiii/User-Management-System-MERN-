require('dotenv').config()
const jwt=require('jsonwebtoken')
const tokenKey=process.env.TOKEN_KEY

const createSecretToken=(res,id)=>{
   const token=jwt.sign({id},tokenKey,{expiresIn:  3 * 24 * 60 * 60,})

   res.cookie('adminToken',token,{
    httpOnly: true,
    secure:process.env.NODE_ENV==='production',
    sameSite:'Strict',
    maxAge:3600000

  })
console.log('cookie sent');

  
  
}

module.exports=createSecretToken