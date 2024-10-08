import React from 'react'
import { useAuth } from './useAuth'
import { Navigate } from 'react-router-dom'
const RequireAuth = ({children}) => {
    const user=useAuth()
    if(!user.userInfo){
        return <Navigate to={"/"} />
    }
  return children
}

export default RequireAuth
