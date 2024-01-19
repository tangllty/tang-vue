/**
 * 接口日志对象
 */
export interface SysLogApi {
  apiId: number
  userId: number
  className: string
  methodName: string
  requestUri: string
  requestType: string
  requestParam: string
  requestBody: string
  responseBody: string
  loginType: string
  ip: string
  location: string
  startTime: Date
  endTime: Date
  costTime: number
  statusCode: string
  message: string
  createBy: string
  createTime: Date
  updateBy: string
  updateTime: Date
  remark: string
}

/**
 * 接口日志表单对象
 */
export interface SysLogApiForm {
  apiId: number
  userId: number
  className: string
  methodName: string
  requestUri: string
  requestType: string
  requestParam: string
  requestBody: string
  responseBody: string
  loginType: string
  ip: string
  location: string
  startTime: Date
  endTime: Date
  costTime: number
  statusCode: string
  message: string
  createBy: string
  createTime: Date
  updateBy: string
  updateTime: Date
  remark: string
}

/**
 * 接口日志查询参数
 */
export interface SysLogApiQuery extends PageQuery {
  apiId: number
  userId: number
  className: string
  methodName: string
  requestUri: string
  requestType: string
  requestParam: string
  requestBody: string
  responseBody: string
  loginType: string
  ip: string
  location: string
  startTime: Date
  endTime: Date
  costTime: number
  statusCode: string
  message: string
  createBy: string
  createTime: Date
  updateBy: string
  updateTime: Date
  remark: string
}
