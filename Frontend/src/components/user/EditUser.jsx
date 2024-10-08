import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../config/axiosConfig";
import { setCredentials } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditUser = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch=useDispatch()
  const [user, setUser] = useState({
    _id: userInfo._id,
    name: userInfo.name,
    email: userInfo.email,
    phone: userInfo.phone,
    image: userInfo.image,
  });
  const [error, setError] = useState({});
const navigate=useNavigate()
  //form-validatiom
  const validateForm = () => {
    const newErrors = {};

    // name validation
    if (!user.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(user.name)) {
      newErrors.name = "Number must contain only letters";
    } else if (user.name.length < 2) {
      newErrors.name = "Name must contain atleast 2 characters";
    }

    //email validation
    if (!user.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Invalid email format";
    }

    //phone validation
    if (!user.phone.trim()) {
      newErrors.phone = "Number is required";
    } else if (!/^\d{10}$/.test(user.phone)) {
      newErrors.phone = "Phone number be 10 digits";
    }

    
    //
    if (!user.image) {
      newErrors.image = "Image is required";
    } else if (!["image/jpeg", "image/png"].includes(user.image.type)) {
      newErrors.image = "Invalid image format";
    }

    setError(newErrors);
    //return true if no errors else return false
    return Object.keys(newErrors).length === 0;
  };

  function handleChange(e) {
    const { name, value, files } = e.target;
    setUser((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  }
  console.log(user, "user");

  async function handleSubmit(e) {
    e.preventDefault();
    //validate Func
    try {
      if (validateForm()) {
      const response=  await axiosInstance.post("/api/users/editUser", user, {
          headers: {
            " Content-Type": "multipart/form-data",
          },
        });
        console.log(response);
        
        if(response.data){
          dispatch(setCredentials(response.data))
          setTimeout(()=>{
            
                  navigate('/home')
          },1000)
        }else{
          console.log("error in post req");
          
        }
      }else{
        console.log("error in validation");
        toast.error("Invalid credentials!")
      }
    } catch (error) {
      if(error.response.status===409){
        toast.error("User already exist!")
      }else{
        toast.error("Something went wrong!")
        console.log("error in submitting", error.message);
      }
      
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          User Profile
        </h2>

        <form
          className="space-y-4"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={user.name}
              onChange={handleChange}
            />
            {error && <span className="text-red-300">{error.name}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={user.email}
              onChange={handleChange}
            />
            {error && <span className="text-red-300">{error.email}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={user.phone}
              onChange={handleChange}
            />
            {error && <span className="text-red-300">{error.phone}</span>}
          </div>
          {/* <!-- Image Upload --> */}
          <div class="mb-4">
            <label for="image" class="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              accept="image/*"
              onChange={handleChange}
            />
            {error && <span className="text-red-300">{error.image}</span>}
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Save Changes
            </button>
            <button
            onClick={()=>navigate('/home')}
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default EditUser;
 