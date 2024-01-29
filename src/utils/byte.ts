/**
 * 格式化为带单位的字符串
 *
 * @param size 字节大小
 * @return 带单位的字符串
 */
export const getSize = (size: number): string => {
  if (size <= 0) {
    return '0 B'
  }

  const sizeUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']
  const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 })
  const digitGroups = Math.floor(Math.log(size) / Math.log(1024))

  return `${formatter.format(size / Math.pow(1024, digitGroups))} ${sizeUnits[digitGroups]}`
}
