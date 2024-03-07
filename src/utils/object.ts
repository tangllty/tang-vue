/**
 * 判断是否是对象字符串
 */
export const isObjectString = (str: string): boolean => {
  try {
    const obj = JSON.parse(str)
    return typeof obj === 'object' && obj !== null
  } catch (error) {
    return false
  }
}

/**
 * 深拷贝
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}
