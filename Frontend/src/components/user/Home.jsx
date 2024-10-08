import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { logout } from "../../store/slices/authSlice";
const apiUrl=import.meta.env.VITE_API_URL

const Home = () => {
  const [userData, setUserData] = useState({});
  const[imgurl,setImgurl]=useState("")
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth.userInfo);
  const user_id = user?.data?._id||user?._id;
  console.log("userid", user_id);
  console.log("user", user);

function fileNameExtractor(imgPath){
     const fullPath=imgPath
     return fullPath.split("/").pop()//filename
}

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/users/${user_id}`);

        setUserData(response.data);
        setImgurl(fileNameExtractor(response.data.image))
        console.log("user-resp", imgurl);

        console.log("userData", userData);
      } catch (error) {
        console.log("error in fetching", error.message);
      }
    };
    fetchUserDetails();
  }, [user_id]);

  async function handleLogout() {
    try {
      const response = await axiosInstance.post("/api/users/logout");
      if (response) {
        dispatch(logout());
        navigate("/");
        console.log(response.data);
      } else {
        console.log("dispatch error");
      }
    } catch (error) {
      console.log("error in logout", error.message);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-500 to-purple-700">
      {/* Navbar */}
      <header className="bg-red-200 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Website</h1>
          <div className="flex items-center space-x-4">
            {/* Edit Profile Button */}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => navigate("/edit-profile")}
            >
              Edit Profile
            </button>
            {/* Logout Button */}
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={handleLogout}
            >
              Logout
            </button>
            {/* Profile Icon */}
            <FaUserCircle
              onClick={() => navigate("/profile")}
              className="text-6xl text-gray-800 hover:text-pink-500 cursor-pointer"
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-700 py-20 text-center text-white ">
        {/* Larger Profile Image */}
        <div className="flex justify-center mb-4">
          <img
            src={`${apiUrl}/uploads/${imgurl}`}
            alt="Profile"
            className="rounded-full w-40 h-40 shadow-lg"
          />
        </div>
        <h2 className="text-4xl font-extrabold mb-4">
          Welcome Back,{userData.name}!
        </h2>
        <p className="text-lg font-light mb-8">
          Manage your account, edit profile details, and stay connected.
        </p>
        {/* <button
          onClick={() => navigate("/profile")}
          className="px-8 py-3 bg-white text-pink-500 font-semibold rounded-full shadow-md hover:bg-gray-200 transition duration-300"
        >
          Go to Profile
        </button> */}
      </section>

      {/* <footer className="bg-gray-800 py-4 text-center text-white">
        <p>&copy; 2024 My Website. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default Home;

