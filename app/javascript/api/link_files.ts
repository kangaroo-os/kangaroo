import api from '../helpers/api'

function addLink(path: string, name: string) {
  return api.post('/link_files/upload', {
    path: path,
    name: name,
  })
}
