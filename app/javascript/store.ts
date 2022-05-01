import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user/userSlice'

export default configureStore({
  reducer: {
    user: userReducer,
  },
})
