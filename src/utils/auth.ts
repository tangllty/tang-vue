import Cookies from 'js-cookie'

/**
 * token key
 */
const tokenKey: string = 'admin-token'

/**
 * 获取 token
 *
 * @returns token
 */
export const getToken = (): string | undefined => {
  return Cookies.get(tokenKey)
}

/**
 * 设置 token
 *
 * @param token token
 */
export const setToken = (token: string): void => {
  Cookies.set(tokenKey, token)
}

/**
 * 移除 token
 */
export const removeToken = (): void => {
  Cookies.remove(tokenKey)
}
