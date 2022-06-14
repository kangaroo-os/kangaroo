import api from '@helpers/api'

export function getAllFiles() {
  return api.get('/files')
}

export function renameFile(id: string, path: string) {
  return api.put(`/files/${id}`, { path: path })
}

export function moveFile(id: string, folderId: string) {
  return api.put(`/files/${id}/move_file`, { folder_id: folderId })
}

export function deleteFile(id: string) {
  return api.delete(`/files/${id}`)
}

export function getFolderFiles(id: string) {
  return api.get(`/files/${id}/get_folder_files`)
}
