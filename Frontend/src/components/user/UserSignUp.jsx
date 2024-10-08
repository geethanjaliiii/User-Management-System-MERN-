import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserSignUp = () => {
  const initialFormData = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    image: null,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(
      { ...formData, [name]: value }
      //[name] dynamically give variable as key with square bracket
    );
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] })); //typically user can select multiple files and forms an array 'files'
  };

  const validateForm = () => {
    const newErrors = {};

    // name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Name must contain only letters";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must contain atleast 2 characters";
    }

    //email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    //phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number be 10 digits";
    }

    //password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 9) {
      newErrors.password = "Password must be atleast 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain atleast one Uppercase letter";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Password must contain atleast one number";
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = "Password must contain special character";
    }

    //confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Field is empty";
    } else if (formData.confirmPassword != formData.password) {
      newErrors.confirmPassword = "Password do not match !";
    }

    //
    if (!formData.image) {
      newErrors.image = "Image is required";
    } else if (
      !["image/jpeg", "image/png"].includes(formData.image.type)
    ) {
      newErrors.image = "Invalid image format";
    }

    setError(newErrors);
    //return true if no errors else return false
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      //submit data to backend
      console.log("form is valid");
      //creating an instance of formdata obj using buit=ltin FormData constructor
      //creates objects containg key-value pairs of form data
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("password", formData.password);
      if (formData?.image) {
        data.append("image", formData.image);
      }
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/signup",
          data,
          {
            header: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      
        
        const { success, message } = response.data;
        if (success) {
          console.log("form submission successfull", response.data);
          toast.success("Signup Successfully");
          setTimeout(() => {
            navigate("/");
          },1000);
        }

        
      } catch (error) {
        console.log("error in form submission", error.message);
        if (error.response && error.response.status===409) {
          setError({ server: error.response.data.message });
          toast.error("User already exist");
          console.log(error);
          
        } else {
          setError({ server: "Something went wrong" });
          toast.error("Something went wrong");
        }
      }
    } else {
      toast.error("Invalid form entry");
      console.log("Invalid form entry");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('images/outer-space-background.jpg')] bg-cover bg-center  ">
      <div className="max-w-md mx-auto mt-5 px-10 py-2 space-y-3 bg-gradient-to-r bg-white/20 shadow-lg backdrop-blur-lg   rounded-lg">
        <h1 className="text-2xl font-bold text-center text-white ">Signup</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div className="flex flex-col space-y-0.5">
            <label htmlFor="name" className="text-white/80 block">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              name="name"
              className="w-full px-3 py-1 rounded-md bg-gray-200"
              placeholder="Enter your name.."
            />
            {error && <span className="text-red-300">{error.name}</span>}
          </div>

          <div className="flex flex-col space-y-0.5">
            <label htmlFor="email" className="text-white/80 block">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              name="email"
              placeholder="Enter you email"
              className="w-full px-3 py-1 rounded-md bg-gray-200"
            />
            {error && <span className="text-red-300">{error.email}</span>}
          </div>

          <div className="flex flex-col space-y-0.5">
            <label htmlFor="phone" className="text-white/80 block">
              Phone
            </label>
            <input
              type="number"
              required
              value={formData.phone}
              onChange={handleChange}
              name="phone"
              placeholder="Enter you number"
              className="w-full px-3 py-1 rounded-md bg-gray-200"
            />
            {error && <span className="text-red-300">{error.phone}</span>}
          </div>

          <div className="flex flex-col space-y-0.5">
            <label htmlFor="password" className="text-white/80 block">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              name="password"
              placeholder="Enter password"
              className="w-full px-3 py-1 rounded-md bg-gray-200"
            />
            {error && <span className="text-red-300">{error.password}</span>}
          </div>

          <div className="flex flex-col space-y-0.5">
            <label htmlFor="confirmPassword" className="text-white/80 block">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              name="confirmPassword"
              placeholder="Confirm password"
              className="w-full px-3 py-1 rounded-md bg-gray-200"
            />
            {error && (
              <span className="text-red-300">{error.confirmPassword}</span>
            )}
          </div>

          <div className="flex flex-col space-y-0.5">
            <label htmlFor="image" className="text-white/80 block">
              Upload Image
            </label>
            <input
              type="file"
              required
              name="image"
              onChange={handleImageChange}
              className="w-full py-1 rounded-md  text-white "
            />
            {error && <span className="text-red-300">{error.image}</span>}
          </div>

          <div className="flex justify-center items-center flex-col gap-0.5">
            <button
              type="submit"
              className="w-3/5 bg-pink-500 hover:bg-purple-950 text-white py-1 px-4 rounded-md transition duration-300"
            >
              Signup
            </button>
            <button
              type="button"
              className="w-3/5 hover:bg-purple-950  text-white py-1 px-4 rounded-md transition duration-300"
              onClick={() => {
                navigate("/");
              }}
            >
              Login
            </button>
            {error && <span className="text-red-300">{error.server}</span>}
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserSignUp;
