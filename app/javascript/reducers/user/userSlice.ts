import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: {
      id: '',
      email: '',
    },
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
