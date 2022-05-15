import api from '../helpers/api'

export function addLink(path: string) {
  return api.post('/link_files/upload', {
    path: path,
  })
}
