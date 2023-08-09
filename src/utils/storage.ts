const windowLocalStorage: Storage = window.localStorage
const windowSessionStorage: Storage = window.sessionStorage

// 浏览器永久存储
interface LocalStorage {
  get: (key: string) => any
  set: (key: string, value: any) => void
  remove: (key: string) => void
  clear: () => void
}

// 浏览器临时存储
interface SessionStorage {
  get: (key: string) => any
  set: (key: string, value: any) => void
  remove: (key: string) => void
  clear: () => void
}

// 浏览器永久存储
export const localStorage: LocalStorage = {
  // 获取 localStorage
  get: (key: string): any => {
    const value: any = windowLocalStorage.getItem(key)
    if (!value) return null
    if (value.indexOf('{') === -1) return value
    return JSON.parse(value)
  },
  // 设置 localStorage
  set: (key: string, value: any): void => {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    windowLocalStorage.setItem(key, value)
  },
  // 移除 localStorage
  remove: (key: string): void => {
    windowLocalStorage.removeItem(key)
  },
  // 清空 localStorage
  clear: (): void => {
    windowLocalStorage.clear()
  }
}

// 浏览器临时存储
export const sessionStorage: SessionStorage = {
  // 获取 sessionStorage
  get: (key: string): any => {
    const value: any = windowSessionStorage.getItem(key)
    if (!value) return null
    if (value.indexOf('{') === -1) return value
    return JSON.parse(value)
  },
  // 设置 sessionStorage
  set: (key: string, value: any): void => {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    windowSessionStorage.setItem(key, value)
  },
  // 移除 sessionStorage
  remove: (key: string): void => {
    windowSessionStorage.removeItem(key)
  },
  // 清空 sessionStorage
  clear: (): void => {
    windowSessionStorage.clear()
  }
}
