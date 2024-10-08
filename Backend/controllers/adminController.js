const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const createSecretToken = require("../utils/AdminSecretToken");

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        console.log("password incorrect");

        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (user.is_admin != 1) {
        return res.status(401).json({ message: "Only admins are allowed" });
      }
      //creating token
      //cookies sent
      createSecretToken(res, user._id);
      //sent data
      res.json({
        message: "Admin Login successfull",
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.phone,
      });
    } else {
      return res.status(401).json({ message: "User doesn't exist!!" });
    }
  } catch (error) {
    console.log("no user", error.message);
    res.status(404).json({ message: "User already exist" });
  }
};

const dashboard = async (req, res) => {
  try {
    const users = await User.find({ is_admin: 0 });
    if (users) {
      res.status(200).json(users);
    }
  } catch (error) {
    console.log("error fetching from db", error.message);
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("adminToken", "", { maxAge: 1 });
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(error.message);

    res.status(404).json({ message: error.message });
  }
};

const hashpassword = async (password) => {
  securePassword = await bcrypt.hash(password, 10);
  return securePassword;
};
const addUser = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const image = req.file ? req.file?.filename : null;
  console.log(image);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
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
    const userData = await user.save();
    if (userData) {
      console.log(userData);
      res
        .status(201)
        .json({
          message: "data saved successfully",
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          phone: userData.image,
          image: userData.image,
        });
    }
  } catch (error) {
    console.log(image);

    console.log("error in adding user-", error.message);
    res.status(409).json({ message: error.message });
  }
};

const editUser = async (req, res) => {
  const user_id = req.params.id;
  const { name, email, phone } = req.body;
  const updateData = req.body;
  const image = req.file ? req.file?.filename : null;
  updateData.image = image;
  console.log("image", image);

  //with email in body check if user already exist
  //with id in params findbyid and update
  try {
    const originalUser = await User.findById(req.params.id);
    const existingUser = await User.findOne({ email });
    if (originalUser.email != email && existingUser.email === email) {
      return res.status(409).json({ message: "User already exist" });
    }
    const updatedUser = await User.findByIdAndUpdate(user_id, updateData, {
      new: true,
    });
    if (updatedUser) {
      res.json(updatedUser);
    }
  } catch (error) {
    console.log("editing failed", error);
    res.status(409).json({ message: error.message });
  }
};

const getDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "_id name email phone image"
    );
    if (!user) {
      return res.status(409).json({ message: "User doesnt exist" });
    }
    console.log("user found");
    res.status(201).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(error.code).json({ message: error.message });
  }
};

const deleteUser=async(req,res)=>{
  const id=req.params.id
  try {
        await User.deleteOne({_id:id})
        const users=await User.find({is_admin:0})
      res.json(users)
      console.log("user deleted");
      
  } catch (error) {
    console.log(error.message);
    res.json({message:"Deletion unsuccessfull"})
  }
}
module.exports = {
  adminLogin,
  dashboard,
  logout,
  addUser,
  editUser,
  getDetails,
  deleteUser
};
