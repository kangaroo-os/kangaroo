import api from '../helpers/api'

export function addLink(url: string) {
  return api.post('/link_files', {
    url: url,
  })
}
