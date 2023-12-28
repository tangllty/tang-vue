import type { FormInstance } from 'element-plus'

/**
 * 重置表单
 *
 * @param formEl 表单实例
 */
export const resetForm = (formEl: FormInstance | undefined): void => {
  if (!formEl) return
  formEl.resetFields()
}
