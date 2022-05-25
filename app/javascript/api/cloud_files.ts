import api from '../helpers/api'
import { getAuthHeaders } from '../helpers/auth'

// Gets all of the users files and folders
export function getAllCloudFiles() {
  return api.get(`/cloud_files`)
}

// Adds a file to the user's cloud
export function addCloudFile(blob: Blob) {
  let formData = new FormData()
  formData.append('file', blob)
  return api.post('/cloud_files', formData, {
    headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeaders() },
  })
}

// Gets the file link for the user's cloud
export function getCloudFileLink(id: number) {
  return api.get(`/cloud_files/${id}`)
}

