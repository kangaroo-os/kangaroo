import axios from 'axios'
import getCsrf from './csrf'

const api = axios.create({
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    common: { 'X-CSRF-TOKEN': getCsrf() },
  },
})

export default api
