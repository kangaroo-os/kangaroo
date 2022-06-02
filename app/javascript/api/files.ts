import api from '../helpers/api'

export function getAllFiles() {
  return api.get('/files')
}

export function renameFile(id: string, path: string) {
  return api.put(`/files/${id}`, { path: path })
}

export function deleteFile(id: string) {
  return api.delete(`/files/${id}`)
}

export function getFolderFiles(file_path: string) {
  return api.get(`/files/get_folder_files?key=${file_path}`)
}

export function searchFiles(search: string) {
  return api.get(`/files?name_search=${search}`)
}
