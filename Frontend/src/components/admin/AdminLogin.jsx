import React, { useState } from "react";
import axiosInstance from "../../config/axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/adminAuthSlice";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  const dispatch = useDispatch();
  const navigate=useNavigate()
  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validateForm() {
    const newError = {};
    if (!formData.email.trim()) {
      newError.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newError.password = "Password is required";
    }

    return Object.keys(newError).length === 0;
  }

  //sumbit form
  async function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axiosInstance.post("/api/users/admin/login", formData);
       
        if (response.data) {
          console.log(response.data);
          dispatch(setCredentials(response.data))
          toast.success("Login successfull")
          setTimeout(()=>{
            navigate('/admin/dashboard')
          },1000)
          
        }
      } catch (error) {
        toast.error("Login Failed")
        console.log("error in post req", error.message);
      }
    } else {
      console.log("Invalid credentials");
      toast.error("Login failed");
    }
  }
  return (
    <div className=" min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url("/images/admin.jpg")' }}>
      <div className="max-w-md mx-auto mt-5 px-8 py-6 bg-white/20 shadow-lg backdrop-blur-md rounded-lg">
        <h1 className="text-3xl font-bold text-center text-white mb-4">
          Login
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div className="flex flex-col space-y-1">
            {/* <label htmlFor="email" className="text-white/80">
              Email
            </label> */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="w-full px-4 py-2 rounded-md bg-gray-100 focus:ring focus:ring-pink-300"
            />
            {/* {error.email && <span className="text-red-400">{error.email}</span>}
             </div> */}
          </div>
          {/* password */}
          <div className="flex flex-col space-y-1">
            {/* <label htmlFor="password" className="text-white/80">
              Password
            </label> */}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="w-full px-4 py-2 rounded-md bg-gray-100 focus:ring focus:ring-pink-300"
            />
            {error.password && (
              <span className="text-red-400">{error.password}</span>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-purple-900 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
