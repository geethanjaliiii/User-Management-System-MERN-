import { useSelector } from "react-redux";

export const useAuth=()=>{
    const userInfo=useSelector((state)=>state?.auth?.userInfo)
    return {userInfo} //returning expected object shape
}

export const useAdminAuth=()=>{
    const adminInfo=useSelector(state=>state?.adminAuth?.adminInfo)

    return {adminInfo:adminInfo||null} //ensure admin info is never undefined
}