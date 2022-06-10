import api from '@helpers/api'

export function getFileUrl(id: number) {
  return api.get(`/abstract_file/${id}`)
}
