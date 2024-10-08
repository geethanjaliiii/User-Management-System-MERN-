const express=require('express')
const verifyAdminToken = require('../middlewares/adminAuthMiddleware')
const {adminLogin,dashboard,logout,addUser,getDetails, editUser,deleteUser}=require('../controllers/adminController')
const upload = require('../multer/multer')
const admin_route=express()

admin_route.post('/login',adminLogin)

admin_route.get('/dashboard',verifyAdminToken,dashboard)

admin_route.post('/addUser',verifyAdminToken,upload.single('image'),addUser)

admin_route.get('/:id',verifyAdminToken,getDetails)

admin_route.put('/edit/:id',verifyAdminToken,upload.single('image'),editUser)

admin_route.post('/logout',logout)

admin_route.post('/delete/:id',verifyAdminToken,deleteUser)

module.exports=admin_route