const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const createSecretToken = require("../utils/SecretToken");

const hashpassword = async (password) => {
  try {
    const securePassword = await bcrypt.hash(password, 10);
    console.log("password hashed", securePassword);

    return securePassword;
  } catch (error) {
    console.log("error in hashing password");
  }
};
const register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const image = req.file ? req.file?.filename : null;
  console.log("data recieved", image);

  try {
    //check if user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("userALREADY EXIST");

      return res.status(409).json({ message: "User already exist!" });
    }
    const spassword = await hashpassword(password);
    const user = new User({
      name,
      email,
      phone,
      password: spassword,
      image: image,
      is_admin: 0,
    });

    //save data in database
    const userData = await user.save();
    if (userData) {
      console.log("data saved in database");
      return res
        .status(201)
        .json({ message: "data saved in database", success: true, user });
    }
  } catch (error) {
    console.log("data not received" + error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const login = async (req, res) => {
  const { password, email } = req.body;
  console.log(req.body);

  try {
    const userExist = await User.findOne({ email });
    console.log(userExist);

    if (!userExist) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const checkPaasword = await bcrypt.compare(password, userExist.password);
    if (!checkPaasword) {
      return res.status(401).json({ message: "Incorrect Password" });
    }
    //creating token-used userid in payload
    createSecretToken(res, userExist._id);

    //set jwt token in secure cookie

    //respond with data
    res.json({
      message: "Login successfull",
      _id: userExist._id,
      name: userExist.name,
      email: userExist.email,
      phone: userExist.phone,
      image: userExist.image,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "server error,Login unsuccessfuk" });
  }
};

const logout = (req, res) => {
  //CLEAR COOKIE
  res.cookie("token", "", { maxAge: 1 });//expire in one milli sec
  res.status(200).json({ message: "Logout mechanism" });
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      -"password is_admin"
    );
    console.log("user",user);
    
    if (!user) {
      console.log("user not found");

      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error.message);

    res.json({ message: "user not Found" });
  }
};

//update
const editUser=async(req,res)=>{
  // const{id,name,phone,email}=req.body
  // const{image}=req?.file?.filename||null
  //email from body and find a user with that email
  //the email of original user noe email of existing user
  try {
    const user_id=req.body._id
  const updateData=req.body
  const updatedEmail=req.body.email
   console.log("updated email",updatedEmail);
   
  const currentUser=await User.findById(user_id).select("email")
  console.log("current user",currentUser);
  
  if(currentUser.email!=updatedEmail){
    const userExist=await User.findOne({email:updatedEmail})
    if(userExist){
      console.log("existing user",userExist);
      
      return res.status(409).json({message:"User already exist!"})
    }
  }
  
  if(req?.file){
    updateData.image=req.file?.filename
  }
 const updatedUser= await User.findByIdAndUpdate(user_id,updateData,{new:true})
 if(updatedUser){
  res.status(200).json({ message: "updation successfull",
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    image: updatedUser.image,})
  console.log("updation success",updatedUser);
  
 }
  } catch (error) {
    
    console.log(error.message);
    // res.status(error.status).json(error.message)
    res.json({message:"updation failed",error})
  }
}



module.exports = {
  register,
  login,
  logout,
  getUserDetails,
  editUser
};
