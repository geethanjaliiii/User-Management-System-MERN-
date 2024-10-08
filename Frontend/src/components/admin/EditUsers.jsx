import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../config/axiosConfig";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";

const EditUsers = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [error, setError] = useState({});
  const { user_id } = location.state;
  
  //fetching and displaying details
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axiosInstance.get(`/api/users/admin/${user_id}`);
        if (response) {
          setUserData(response.data);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
  }, []);

  function handleChange(e) {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log("data", userData);
  }

  function handleImageChange(e) {
    const { name, files } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: files[0],
      imagePreview: URL.createObjectURL(files[0]),
    }));
  }

  //validate form
  function validateForm() {
    const newErrors = {};

    // name validation
    if (!userData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(userData.name)) {
      newErrors.name = "Number must contain only letters";
    } else if (userData.name.length < 2) {
      newErrors.name = "Name must contain atleast 2 characters";
    }

    //email validation
    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = "Invalid email format";
    }

    //phone validation
    if (!userData.phone.trim()) {
      newErrors.phone = "Number is required";
    } else if (!/^\d{10}$/.test(userData.phone)) {
      newErrors.phone = "Phone number be 10 digits";
    }

    //
    if (!userData.image) {
      newErrors.image = "Image is required";
    } else if (!["image/jpeg", "image/png"].includes(userData.image.type)) {
      newErrors.image = "Invalid image format";
    }

    setError(newErrors);
    //return true if no errors else return false
    return Object.keys(newErrors).length === 0;
  }

  //handle submit
  async function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      const data = new FormData();
      try {
        data.append("_id", user_id);
        data.append("image", userData.image);
        data.append("name", userData.name);
        data.append("email", userData.email);
        data.append("phone", userData.phone);
        console.log("submitted",data);

        const response = await axiosInstance.put(`/api/users/admin/edit/${user_id}`, data);
        if (response) {
          dispatch(setCredentials(response.data));
          console.log("data updated", response.data);
        }
      } catch (error) {
        console.log("error in submission", error.message);
        
        if(error.response && error.response.status===409){
          console.log(error.response.data.message);
          toast.error("User already exist!")
        }
      }
    }
    console.log("ready to submit");
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: 'url("/images/login.jpg")' }} // Add your background image path here
    >
      <div className="bg-white/30 shadow-2xl rounded-xl p-10 w-full max-w-xl relative z-10 ">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Edit User Profile
        </h2>

        <form
          className="space-y-6 "
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          {/* Image Upload */}
          <div className="relative  flex justify-center items-center">
            <img
              onClick={() => document.getElementById("imageInput").click()} 
              alt="Profile"
              className="rounded-full w-32 h-32 shadow-lg"
              src={
                userData.imagePreview
                  ? userData.imagePreview
                  : `http://localhost:5000/uploads/${userData.image}`
              }
            />

            {/* text on image */}
            <div
              onClick={() => document.getElementById("imageInput").click()}
              className="absolute inset-0 rounded-full flex justify-center items-center">
              <p className="text-white/70 font-semibold text-sm pt-5">
                Select Image
              </p>
            </div>

            <input
              id="imageInput"
              type="file"
              name="image"
                className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            {error && (
              <span className="text-red-500 text-sm">{error.image}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Name
            </label>
            <input
              name="name"
              type="text"
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
              value={userData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            {error && (
              <span className="text-red-500 text-sm">{error.name}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
              value={userData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {error && (
              <span className="text-red-500 text-sm">{error.email}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              type="text"
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
              value={userData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
            {error && (
              <span className="text-red-500 text-sm">{error.phone}</span>
            )}
          </div>

          <div className="flex justify-between items-center space-x-4">
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-950 transition-all"
            >
              Save Changes
            </button>
            <button
              onClick={() => navigate("/admin/dashboard")}
              type="button"
              className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
      <ToastContainer />
    </div>
  );
};

export default EditUsers;
