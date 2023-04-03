import Cookies from 'js-cookie'

const tokenKey: string = 'admin-token'

export function getToken(): string | undefined {
  return Cookies.get(tokenKey)
}

export function setToken(token: string): void {
  Cookies.set(tokenKey, token)
}

export function removeToken(): void {
  return Cookies.remove(tokenKey)
}
