import axios from 'axios'
import getCsrf from './csrf'
import { getAuthHeaders } from './auth'

const api = axios.create({
  xsrfHeaderName: 'X-CSRFToken',
  headers: { ...getAuthHeaders(), common: { 'X-CSRF-Token': getCsrf() } },
})

export function addAuthHeaders() {
  api.defaults.headers = { ...getAuthHeaders(), common: { 'X-CSRF-Token': getCsrf() } }
}

export function removeAuthHeaders() {
  delete api.defaults.headers
}

export default api
