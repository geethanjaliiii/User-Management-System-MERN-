import { Navigate } from "react-router-dom"
import { useAuth } from "./useAuth"

const IsLogout=({children})=>{
    const user=useAuth()
    if(user.userInfo){
         return <Navigate to={'/home'}/>
    }
    return children
}
export default IsLogout