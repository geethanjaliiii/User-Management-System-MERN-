import { useAdminAuth } from "./useAuth";
import { Navigate } from "react-router-dom";
const IsAdminLogout=({children})=>{
    const admin=useAdminAuth()
    if(admin.adminInfo){
        return <Navigate to={'/admin/dashboard'}/>
    }
    return children
}

export default IsAdminLogout
