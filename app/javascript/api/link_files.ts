import api from '../helpers/api'
import { getAuthHeaders } from '../helpers/auth'

export function addLink(path: string) {
  return api.post(
    '/link_files/upload',
    {
      path: path,
    },
    { headers: getAuthHeaders() },
  )
}
