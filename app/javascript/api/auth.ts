import api from '../helpers/api'
import User from '../models/User'

export async function logout(user: User | undefined) {
  if (!user) {
    throw 'There is no user to logout'
  }
  return api.delete('/auth/sign_out', {
    headers: {
      uid: user.email,
      client: user.client,
      'access-token': user.accessToken,
    },
  })
}

export async function signup(full_name: string, email: string, password: string) {
  return api.post('/auth', {
    full_name: full_name,
    email: email,
    password: password,
    password_confirmation: password,
    confirm_success_url: '/desktop',
  })
}

export async function login(email: string, password: string) {
  return api.post('/auth/sign_in', {
    email: email,
    password: password,
  })
}
