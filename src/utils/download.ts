import { saveAs } from 'file-saver'

/**
 * 下载文件
 *
 * @param res response
 * @param fileName 文件名
 */
export const download = (res: any, fileName: string): void => {
  const blob: Blob = new Blob([res.data], { type: res.headers['content-type'] })
  const contentDisposition: string = res.headers['content-disposition']
  if (!fileName) {
    fileName = contentDisposition.split(';')[1].split('=')[1]
  }
  saveAs(blob, fileName)
}
