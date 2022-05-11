
export function getAuthHeaders() {
  let user = JSON.parse(localStorage.getItem('user'))
  return {
    'access-token': user.accessToken,
    'token-type': 'Bearer',
    client: user.client,
    expiry: String(user.tokenExpiresAt),
    uid: user.email,
  }
}
