import Cookies from 'js-cookie'

const tokenKey: string = 'admin-token'

// 获取 token
export const getToken = (): string | undefined => {
  return Cookies.get(tokenKey)
}

// 设置 token
export const setToken = (token: string): void => {
  Cookies.set(tokenKey, token)
}

// 移除 token
export const removeToken = (): void => {
  return Cookies.remove(tokenKey)
}
