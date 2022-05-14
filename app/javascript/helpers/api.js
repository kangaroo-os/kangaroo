import axios from 'axios'
import getCsrf from './csrf'
import { getAuthHeaders } from './auth'

let headers = { ...getAuthHeaders(), common: { 'X-CSRF-Token': getCsrf() } }

const api = axios.create({
  xsrfHeaderName: 'X-CSRFToken',
  headers: headers,
})

export default api
