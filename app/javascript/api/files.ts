import api from '../helpers/api'
import { getAuthHeaders } from '../helpers/auth'

export function getAllFiles() {
  return api.get('/files')
}

export function deleteFile(id: number) {
  return api.delete(`/files/${id}`)
}