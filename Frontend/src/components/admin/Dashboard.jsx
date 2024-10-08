import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../config/axiosConfig";
import { adminLogout } from "../../store/slices/adminAuthSlice";
import { logout } from "../../store/slices/authSlice";
import { toast,ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchInp, setSeachInp] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const admin = useSelector((state) => state?.adminAuth?.adminInfo);

  useEffect(() => {
    async function fetchUsersDetails() {
      try {
        const userList = await axiosInstance.get("/api/users/admin/dashboard");
        setUsers(userList.data);
        console.log(userList);
        
      } catch (error) {
        console.log("fetching users failed", error.message);
      }
    }
    fetchUsersDetails();
  }, [searchInp]);

  //handle search operation
  function handleSearch() {
    const regex = new RegExp(searchInp, "i");
    const searchResult = users.filter(
      (user) => regex.test(user.name) || regex.test(user.email)
    );
    setUsers(searchResult);
  }

  //handle logout
  async function handleLogout() {
    try {
      const response = await axiosInstance.post("/api/users/admin/logout");
      if (response) {
        
        dispatch(adminLogout());
        toast.success("Logout Successfully");
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      }
    } catch (error) {
      console.log("error in logout");
      toast.error("Logout failed");
    }
  }

  async function handleDelete(user_id){
    try {
     
     const response= await axiosInstance.post(`/api/users/admin/delete/${user_id}`)
      setUsers(response.data)
      dispatch(logout())
     console.log("user deleted",response.data);
     toast.success("User Deleted successfully")
     
    } catch (error) {
      console.log(error.message);
      
    }
  }
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-end">
        <button
          className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-100 text-center mb-8">
          Admin Dashboard
        </h1>

        <div className="bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">
            Welcome, {admin?.name}
          </h2>

          {/* Search Input */}
          <div className="flex items-center gap-4 mb-6">
            <input
              className="w-full p-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-gray-200"
              type="text"
              onChange={(e) => setSeachInp(e.target.value)}
              value={searchInp}
              placeholder="Search by name or email..."
            />
            <button
              onClick={handleSearch}
              className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Search
            </button>
          </div>

          {/* Add User Button */}
          <div className="mb-6">
            <button
              onClick={() => {
                navigate("/admin/add-user");
              }}
              className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-500 transition"
            >
              Add User
            </button>
          </div>

          {/* User List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users &&
              users.map((user) => (
                <div
                  key={user._id}
                  className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold text-gray-200 mb-2">
                    {user.name}
                  </h3>
                  <p className="text-gray-400 mb-4">{user.email}</p>

                  {/* Edit and Delete buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigate("/admin/edit-user", {
                          state: { user_id: user._id },
                        });
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-400 transition"
                    >
                      Edit User
                    </button>
                    <button 
                    onClick={()=>handleDelete(user._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-500 transition">
                      Delete User
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* No users found message */}
          {users.length === 0 && (
            <p className="text-center text-gray-400 mt-6">No users found</p>
          )}
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Dashboard;




