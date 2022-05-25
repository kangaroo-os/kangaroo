
import api from '../helpers/api'
import { getAuthHeaders } from '../helpers/auth'

// Creates a new folder at the path
export function createFolder(path: string) {
  return api.post(`/folder_files`, { path })
}