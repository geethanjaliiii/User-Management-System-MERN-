const mongoose=require('mongoose')
require('dotenv').config()

const uri=process.env.MONGO_URL

const connectDB=async()=>{
    try {
        await mongoose.connect(uri)
        console.log("database connected successfully");
        
    } catch (error) {
        console.log("database not connected");
        
    }
}
module.exports=connectDB