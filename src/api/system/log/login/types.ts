// 登陆日志对象
export interface SysLogLogin {
  loginId: number
  userId: number
  account: string
  loginType: string
  os: string
  browser: string
  ip: string
  location: string
  loginTime: Date
  success: string
  message: string
}

// 登陆日志表单对象
export interface SysLogLoginForm {
  loginId: number
  userId: number
  account: string
  loginType: string
  os: string
  browser: string
  ip: string
  location: string
  loginTime: Date
  success: string
  message: string
}

// 登陆日志查询参数
export interface SysLogLoginQuery extends PageQuery {
  loginId: number
  userId: number
  account: string
  loginType: string
  os: string
  browser: string
  ip: string
  location: string
  loginTime: Date
  success: string
  message: string
}
