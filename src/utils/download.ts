import { saveAs } from 'file-saver'

/**
 * 下载文件
 *
 * @param res 响应
 * @param fileName 文件名
 */
export const download = (res: any, fileName: string = ''): void => {
  const blob: Blob = new Blob([res.data], { type: res.headers['content-type'] })
  const contentDisposition: string = res.headers['content-disposition']
  if (!fileName) {
    fileName = contentDisposition.split(';')[1].split('=')[1]
  }
  saveAs(blob, fileName)
}

/**
 * 下载文件
 *
 * @param url 文件地址
 * @param fileName 文件名
 */
export const downloadUrl = (url: string, fileName: string = ''): void => {
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
}
