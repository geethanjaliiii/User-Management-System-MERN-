import {configureStore} from '@reduxjs/toolkit'

import authSlice from './slices/authSlice'
import adminAuthSlice from './slices/adminAuthSlice'

const store=configureStore({
    reducer:{
        //name of slice:slice
        auth:authSlice,
        adminAuth:adminAuthSlice
    },
    devTools:true,
})

export default store