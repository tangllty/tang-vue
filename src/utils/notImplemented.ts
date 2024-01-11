import { ElMessage } from 'element-plus'

export const notImplemented = () => {
  ElMessage({
    message: 'Not implemented yet.',
    type: 'warning'
  })
  throw new Error('Not implemented yet.')
}
