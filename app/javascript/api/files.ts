import api from '../helpers/api'

export function getAllFiles() {
  return api.get('/files')
}

export function renameFile(id: string, name: string) {
  return api.put(`/files/${id}`, { name: name })
}

export function deleteFile(id: number) {
  return api.delete(`/files/${id}`)
}
