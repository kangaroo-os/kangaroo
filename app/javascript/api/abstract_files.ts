import api from '@helpers/api'

export function getFileUrl(id: number) {
  return api.get(`/files/${id}`)
}

export function makeFileShareable(id: number, isPublic: boolean) {
  return api.put(`/files/${id}/make_publicly_accessible`, { is_public: isPublic })
}

export function getSharedFiles(public_share_url: string) {
  return api.get(`/shared_files/${public_share_url}`)
}

export function getSharedFile(public_share_url: string) {
  return api.get(`/shared_files/${public_share_url}`)
}