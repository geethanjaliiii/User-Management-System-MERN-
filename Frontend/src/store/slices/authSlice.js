import { createSlice } from "@reduxjs/toolkit";



const initialState={
    userInfo:localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem("userInfo")):null //we will fetch this from server using token
}

const authSlice=createSlice({
    name: "auth",
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
           state.userInfo=action.payload
           localStorage.setItem("userInfo",JSON.stringify(action.payload))//saving to local storage
        },
        //frontend logout
        logout:(state)=>{
            state.userInfo=null
            localStorage.removeItem("userInfo")
        }
    }
})
export const {setCredentials, logout}=authSlice.actions;
export default authSlice.reducer;