import api from '../helpers/api'
import User from '../models/User'


// Gets all of the users files and folders
export function getAllFiles(user: User) {
  return api.get(`/cloud_files`, {
    headers: getAuthHeaders(user),
  })
}

// Adds a file to the user's cloud
export function addFile(user: User, file: FormData) {
  return api.post('/cloud_files/upload', file, {
    headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeaders(user) },
  })
}

// Deletes the file from the user's cloud
export function deleteFile(user: User, id: number) {
  api.delete(`/cloud_files/${id}`, { headers: getAuthHeaders(user) })
}

// Gets the file link for the user's cloud
export function getFileLink(user: User, id: number) {
  return api.get(`/cloud_files/${id}`, { headers: getAuthHeaders(user) })
}

// Creates a new folder at the path
export function createFolder(user: User, path: string) {
  return api.post(`/cloud_files/create_folder`, { path }, { headers: getAuthHeaders(user) })
}

export function getAuthHeaders(user: User) {
  return {
    'access-token': user.accessToken,
    'token-type': 'Bearer',
    client: user.client,
    expiry: String(user.tokenExpiresAt),
    uid: user.email,
  }
}
