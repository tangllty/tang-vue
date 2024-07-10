/**
 * 调查问卷用户答案对象
 */
export interface SurveyUserAnswer {
  answerId: number
  formId: number
  answerData: string
  answerTime: number
  ip: string
  location: string
  mobile: string
  browser: string
  version: string
  platform: string
  os: string
  osVersion: string
  engine: string
  engineVersion: string
  createBy: string
  createTime: Date
  updateBy: string
  updateTime: Date
  remark: string
}

/**
 * 调查问卷用户答案表单对象
 */
export interface SurveyUserAnswerForm {
  answerId: number
  formId: number
  answerData: string
  answerTime: number
  ip: string
  location: string
  mobile: string
  browser: string
  version: string
  platform: string
  os: string
  osVersion: string
  engine: string
  engineVersion: string
  createBy: string
  createTime: Date
  updateBy: string
  updateTime: Date
  remark: string
}

/**
 * 调查问卷用户答案查询参数
 */
export interface SurveyUserAnswerQuery extends PageQuery {
  answerId: number
  formId: number
  answerData: string
  answerTime: number
  ip: string
  location: string
  mobile: string
  browser: string
  version: string
  platform: string
  os: string
  osVersion: string
  engine: string
  engineVersion: string
  createBy: string
  createTime: Date
  updateBy: string
  updateTime: Date
  remark: string
}
