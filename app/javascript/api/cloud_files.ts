import api from '../helpers/api'
import { getAuthHeaders } from '../helpers/auth'

// Gets all of the users files and folders
export function getAllCloudFiles() {
  return api.get(`/cloud_files`, {
    headers: getAuthHeaders(),
  })
}

// Adds a file to the user's cloud
export function addCloudFile(blob: Blob) {
  let formData = new FormData()
  formData.append('file', blob)
  return api.post('/cloud_files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeaders() },
  })
}

// Using the api/files endpoint, deletes a file from the user's cloud
// // Deletes the file from the user's cloud
// export function deleteFile(id: number) {
//   return api.delete(`/cloud_files/${id}`, { headers: getAuthHeaders() })
// }

// Gets the file link for the user's cloud
export function getCloudFileLink(id: number) {
  return api.get(`/cloud_files/${id}`, { headers: getAuthHeaders() })
}

// Creates a new folder at the path
export function createFolder(path: string) {
  return api.post(`/cloud_files/create_folder`, { path }, { headers: getAuthHeaders() })
}
