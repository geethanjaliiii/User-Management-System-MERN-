import { useAdminAuth } from "./useAuth";
import { Navigate } from "react-router-dom";
const IsAdminLogin=({children})=>{

    const admin=useAdminAuth()
    if(!admin.adminInfo){
        return <Navigate to={'/admin'}/>
    }
    return children
}
export default IsAdminLogin