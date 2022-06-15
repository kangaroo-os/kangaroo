
import api from '../helpers/api'
import { getAuthHeaders } from '../helpers/auth'

// Creates a new folder at the path
export function createFolder(id: string) {
  return api.post(`/folder_files`, { id })
}

export function getFolderFiles(id: string) {
  return api.get(`/folder_files/${id}/get_folder_files`)
}