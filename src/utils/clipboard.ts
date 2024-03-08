import { ElMessage } from 'element-plus'

/**
 * 复制文本
 *
 * @param code 代码
 * @param callback 回调
 */
export const copy = async (code: string, callback: () => void = () => ElMessage.success('复制成功')) => {
  await navigator.clipboard.writeText(code)
  try {
    callback()
  } catch (error) {
    console.error(error)
  }
}
