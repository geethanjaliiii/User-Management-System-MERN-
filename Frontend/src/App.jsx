import { useState } from "react";
import { Provider } from "react-redux";
import UserLoginPage from "./pages/user/UserLoginPage";
import UserSignupPage from "./pages/user/UserSignupPage";
import HomePage from "./pages/user/HomePage";
import EditUser from "./components/user/EditUser";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "./components/admin/AdminLogin";
import Dashboard from "./components/admin/Dashboard";
import AddUser from "./components/admin/AddUser";
import EditUsers from "./components/admin/EditUsers";
import store from "./store/store";
import RequireAuth from "./store/protect/RequireAuth";
import IsLogout from "./store/protect/IsLogout";
import IsAdminLogin from "./store/protect/IsAdminLogin";
import IsAdminLogout from "./store/protect/IsAdminLogout";

function App() {
  return (
    <>
      <Provider store={store}>
        <Routes>
          <Route path="/signup" element={<UserSignupPage />} />
          <Route
            path="/"
            element={
              <IsLogout>
                <UserLoginPage />
              </IsLogout>
            }
          />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <RequireAuth>
                <EditUser />
              </RequireAuth>
            }
          />
          <Route path="/admin"
           element={
           <IsAdminLogout>
            <AdminLogin />
           </IsAdminLogout>} />
          <Route
            path="/admin/dashboard"
            element={
              <IsAdminLogin>
                <Dashboard />
              </IsAdminLogin>
            }
          />
          <Route
            path="/admin/add-user"
            element={
              <IsAdminLogin>
                <AddUser />
              </IsAdminLogin>
            }
          />
          <Route
            path="/admin/edit-user"
            element={
              <IsAdminLogin>
                <EditUsers />
              </IsAdminLogin>
            }
          />
          
        </Routes>
      </Provider>
    </>
  );
}

export default App;
