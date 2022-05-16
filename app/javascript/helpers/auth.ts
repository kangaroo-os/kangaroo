import { getUser } from "../states/userState"

export function getAuthHeaders() {
  let user = getUser()
  if (user) {
    return {
      'access-token': user.accessToken,
      'token-type': 'Bearer',
      client: user.client,
      expiry: String(user.tokenExpiresAt),
      uid: user.email,
    }
  }
  return {}
}