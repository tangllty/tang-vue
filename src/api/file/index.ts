import request from '@/utils/request'
import type { UploadFile } from 'element-plus'

/**
 * 上传文件
 *
 * @param file 文件
 * @returns 上传地址
 */
export const uploadFile = (file: File | UploadFile) => {
  const formData = new FormData()
  if ('raw' in file) {
    formData.append('file', (file as UploadFile).raw as Blob)
  } else {
    formData.append('file', file as Blob)
  }

  return request({
    url: '/file/upload',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
