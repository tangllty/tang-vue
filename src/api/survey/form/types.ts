/**
 * 调查问卷对象
 */
export interface SurveyForm {
  formId: number
  formCode: number
  formName: string
  formData: string
  publishStatus: string
  publishTime: Date
  closeTime: Date
  status: string
  createBy: string
  createTime: Date
  updateBy: string
  updateTime: Date
  remark: string
}

/**
 * 调查问卷表单对象
 */
export interface SurveyFormForm {
  formId: number
  formCode: number
  formName: string
  formData: string
  publishStatus: string
  publishTime: Date
  closeTime: Date
  status: string
  createBy: string
  createTime: Date
  updateBy: string
  updateTime: Date
  remark: string
}

/**
 * 调查问卷查询参数
 */
export interface SurveyFormQuery extends PageQuery {
  formId: number
  formCode: number
  formName: string
  formData: string
  publishStatus: string
  publishTime: Date
  closeTime: Date
  status: string
  createBy: string
  createTime: Date
  updateBy: string
  updateTime: Date
  remark: string
}
