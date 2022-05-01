import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/user/userSlice'

export default configureStore({
  reducer: {
    user: userReducer,
  },
})
