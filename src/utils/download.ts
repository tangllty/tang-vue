import { saveAs } from 'file-saver'

export function zip(res: any): void {
  const blob: Blob = new Blob([res.data], { type: 'application/zip' })
  const contentDisposition: string = res.headers['content-disposition']
  const fileName: string = contentDisposition.split(';')[1].trim().slice(9).replaceAll('"', '')
  saveAs(blob, fileName)
}
