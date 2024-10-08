const multer=require('multer')
const path =require('path')
const fs=require('fs')

function ensureDirExist(directory){
    if(!fs.existsSync(directory)){
        fs.mkdirSync(directory,{recursive:true})
    }
}
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        const uploadDir=path.join(__dirname,'uploads') //ATTACHES UPLOADS TO THE CURRENT DIRECTORY
        ensureDirExist(uploadDir)
        cb(null,uploadDir)
    },
    filename:(req,file,cb)=>{
        const sanitisedOrgName=file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')
        const newFilename=`${file.fieldname}_${Date.now()}_${sanitisedOrgName}`
        // creating unique filename
        console.log(newFilename);
        
        cb(null,newFilename)
    }
})

const upload=multer({storage:storage})
module.exports=upload