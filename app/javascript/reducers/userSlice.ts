import { createSlice } from '@reduxjs/toolkit'
import User from '../models/User'

const user: User | null = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null
const initialState = user
  ? {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      client: user.client,
      accessToken: user.accessToken,
      tokenExpiresAt: user.tokenExpiresAt,
    }
  : undefined

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: initialState,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCurrentUser } = userSlice.actions

export default userSlice.reducer
