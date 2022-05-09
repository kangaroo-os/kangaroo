import { createSlice } from '@reduxjs/toolkit'

export const desktopSlice = createSlice({
  name: 'desktop',
  initialState: {
    value: {
      uploading: false,
      files: [],
    },
  },
  reducers: {
    setUploading: (state, action) => {
      state.value.uploading = action.payload
    },

    addFile: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.value.files.push(...action.payload)
      } else {
        state.value.files.push(action.payload)
      }
    },
    removeFile: (state, action) => {
      state.value.files = state.value.files.filter((file) => file.id !== action.payload)
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUploading, addFile, removeFile } = desktopSlice.actions

export default desktopSlice.reducer
