import { createSlice } from '@reduxjs/toolkit'

const user = JSON.parse(sessionStorage.getItem('user') === 'undefined' ? '{}' : sessionStorage.getItem('user'))
const initialState = user ? { id: user.id, email: user.email } : {}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: initialState,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.value = action.payload
      console.log('SETTING:', state.value)
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCurrentUser } = userSlice.actions

export default userSlice.reducer
