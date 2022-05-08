import api from '../helpers/api'
import User from '../models/User'

export function getAllFiles(user: User) {
  return api.get(`/cloud_files`, {
    headers: getAuthHeaders(user),
  })
}

export function addFile(user: User, file: FormData) {
  return api.post('/cloud_files/upload', file, {
    headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeaders(user) },
  })
}

export function deleteFile(user: User, id: number) {
  api.delete(`/cloud_files/${id}`, { headers: getAuthHeaders(user) })
}

export function getFileLink(user: User, id: number) {
  return api.get(`/cloud_files/${id}`, { headers: getAuthHeaders(user) })
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
