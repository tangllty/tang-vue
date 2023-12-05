const windowLocalStorage: Storage = window.localStorage
const windowSessionStorage: Storage = window.sessionStorage

/**
 * 浏览器永久存储
 */
interface LocalStorage {
  get: (key: string) => any
  set: (key: string, value: any) => void
  remove: (key: string) => void
  clear: () => void
}

/**
 * 浏览器临时存储
 */
interface SessionStorage {
  get: (key: string) => any
  set: (key: string, value: any) => void
  remove: (key: string) => void
  clear: () => void
}

/**
 * 浏览器永久存储
 */
export const localStorage: LocalStorage = {
  /**
   * 获取 localStorage
   *
   * @param key 键
   * @returns localStorage
   */
  get: (key: string): any => {
    const value: any = windowLocalStorage.getItem(key)
    return JSON.parse(value)
  },
  /**
   * 设置 localStorage
   *
   * @param key 键
   * @param value 值
   */
  set: (key: string, value: any): void => {
    windowLocalStorage.setItem(key, JSON.stringify(value))
  },
  /**
   * 移除 localStorage
   *
   * @param key 键
   */
  remove: (key: string): void => {
    windowLocalStorage.removeItem(key)
  },
  /**
   * 清空 localStorage
   */
  clear: (): void => {
    windowLocalStorage.clear()
  }
}

/**
 * 浏览器临时存储
 */
export const sessionStorage: SessionStorage = {
  /**
   * 获取 sessionStorage
   *
   * @param key 键
   * @returns sessionStorage
   */
  get: (key: string): any => {
    const value: any = windowSessionStorage.getItem(key)
    return JSON.parse(value)
  },
  /**
   * 设置 sessionStorage
   *
   * @param key 键
   * @param value 值
   */
  set: (key: string, value: any): void => {
    windowSessionStorage.setItem(key, JSON.stringify(value))
  },
  /**
   * 移除 sessionStorage
   *
   * @param key 键
   */
  remove: (key: string): void => {
    windowSessionStorage.removeItem(key)
  },
  /**
   * 清空 sessionStorage
   */
  clear: (): void => {
    windowSessionStorage.clear()
  }
}
