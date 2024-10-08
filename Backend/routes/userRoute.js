const express=require('express')
const user_route=express()
const userController=require('../controllers/userController')
const upload=require('../multer/multer')
const verifyToken =require('../middlewares/authMiddleware')
const {register,login, logout, getUserDetails,editUser}=require('../controllers/userController')



user_route.post('/signup',upload.single('image'),register)

user_route.post('/login',login)

user_route.post('/logout',logout)

user_route.get('/:id',verifyToken,getUserDetails)

user_route.post('/editUser',verifyToken,upload.single('image'),editUser)


module.exports=user_route