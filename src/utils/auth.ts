import Cookies from 'js-cookie'

const tokenKey = 'admin-token'

export function getToken() {
  return Cookies.get(tokenKey)
}

export function setToken(token: string) {
  Cookies.set(tokenKey, token)
}

export function removeToken() {
  return Cookies.remove(tokenKey)
}
