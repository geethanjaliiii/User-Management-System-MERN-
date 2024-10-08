import React, { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import axiosInstance from "../../config/axiosConfig";

const UserLogin = () => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    // validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required!";
    } 

    //validate password
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setError(newErrors);
    // return true if no error ,return false if error
    return Object.keys(newErrors).length === 0; 
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form is valid ,proceed to home");


    //data and FormData() are builin
      const data=new FormData()
      data.append("email",formData.email)
      data.append("password",formData.password)
      
      
      try {
        const response=await axiosInstance.post('/api/users/login',formData)
        console.log(response.data)
        dispatch(setCredentials(response.data))
        toast.success('User logged successfully')
        setTimeout(()=>{
         navigate('/home')
        },1000)
         
         console.log(response);
        // const response=await axios.post("http://localhost:5000/api/users/login",loginData )
      } catch (error) {
        console.log(error.response?.data||error.message);
        toast.error(error.message)
      }
    } else {
      toast.error("Invalid Credentials")
      console.log("invalid credntials" );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('images/outer-space-background.jpg')] bg-cover bg-center">
      <div className="max-w-md mx-auto mt-5 px-8 py-6 bg-white/20 shadow-lg backdrop-blur-md rounded-lg">
        <h1 className="text-3xl font-bold text-center text-white mb-4">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data"> 
          {/* Email Field */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="text-white/80">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-100 focus:ring focus:ring-pink-300"
            />
            {error.email && <span className="text-red-400">{error.email}</span>}
          </div>

          {/* Password Field */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="password" className="text-white/80">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-100 focus:ring focus:ring-pink-300"
            />
            {error.password && (
              <span className="text-red-400">{error.password}</span>
            )}
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-purple-900 text-white font-semibold py-2 px-4 rounded-md transition duration-300 mt-2" 
            >
              Login
            </button>
          </div>
          <div className="flex justify-center">
          <button
              type="button"
              className="w-full hover:bg-purple-950  text-white py-1 px-4 rounded-md transition duration-300"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Signup
            </button>
          </div>
         
         
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default UserLogin;
