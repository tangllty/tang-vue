/**
 * 获取完整路径
 *
 * @param path 路径
 * @returns 完整路径
 */
export const getFullPath = (path: string): string => {
  return import.meta.env.VITE_APP_BASE_API + path
}
