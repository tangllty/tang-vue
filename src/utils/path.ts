/**
 * 获取完整路径
 *
 * @param path 路径
 * @returns 完整路径
 */
export const getFullPath = (path: string): string => {
  return import.meta.env.VITE_APP_BASE_API + path
}

/**
 * 解析路径
 *
 * @param paths 路径
 * @returns 完整路径
 */
export const resolve = (...paths: string[]): string => {
  const empty = ''
  const slash = '/'
  const slashCode = slash.charCodeAt(0)
  return paths
    .filter(path => path !== empty)
    .reduce((resolvedPath, path) => {
      if (path.charCodeAt(0) === slashCode || resolvedPath === empty) {
        return path
      }
      return resolvedPath + slash + path
    }, empty)
}
