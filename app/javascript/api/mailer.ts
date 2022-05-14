import api from '../helpers/api'
import { getAuthHeaders } from '../helpers/auth'

export function email_olivia(complaint: string) {
  return api.post('email_olivia', { complaint: complaint }, { headers: getAuthHeaders() })
}
