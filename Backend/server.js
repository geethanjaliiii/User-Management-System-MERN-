const express=require ('express')
const connectDB=require('./config/connectDB')
const cors=require('cors')
const path=require('path')
const dotenv=require('dotenv')
dotenv.config()
const userRoute= require('./routes/userRoute')
const adminRoute=require('./routes/adminRoute')
const cookieParser = require('cookie-parser')
const app=express()

const {notFound,errorHandler} =require('./middlewares/errorMiddleware')
//connection to db
connectDB()

//setting up cors for frontend to make request to server
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.urlencoded({extended:true}))
//middleware to parse incomming req from frontend
app.use(express.json())
app.use(cookieParser())
const PORT=process.env.PORT|| 5000

//ensure its current working directory
app.use('/uploads',express.static(path.join(process.cwd(),'multer',"uploads")))

app.use('/api/users',userRoute)

app.use('/api/users/admin',adminRoute)

app.use(notFound)
app.use(errorHandler)
app.listen(PORT,()=>{
    console.log(`Server is running at ${"http://localhost:5000/"}`);
})