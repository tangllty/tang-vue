// 用户对象
export interface SysUser {
  userId: number
  deptId: number
  username: string
  nickname: string
  email: string
  phone: string
  gender: string
  avatar: string
  status: string
  loginIp: string
  loginDate: Date
  createBy: string
  createTime: Date
  updateBy: string
  updateTime: Date
  remark: string
}

// 用户表单对象
export interface SysUserForm {
  deptId: number
  username: string
  nickname: string
  email: string
  phone: string
  gender: string
  avatar: string
  remark: string
}

// 用户查询参数
export interface SysUserQuery extends PageQuery {
  username: string
  nickname: string
  gender: string
  status: string
}
