// 在线用户对象
export interface OnlineUser {
  token: string
  username: string
  deptName: string
  nickname: string
  email: string
  phone: string
  gender: string
  status: string
  delFlag: string
  loginIp: string
  loginDate: string
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
  loginType: string
  loginTime: string
  expireTime: string
}

// 在线用户查询参数
export interface OnlineUserQuery extends PageQuery {
  token: string
  username: string
  deptName: string
  nickname: string
  email: string
  phone: string
  gender: string
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
  loginType: string
  loginTime: string
  expireTime: string
}
