import api from '../helpers/api'

export function getAllFiles() {
  return api.get('/files')
}

export function deleteFile(id: number) {
  return api.delete(`/files/${id}`)
}