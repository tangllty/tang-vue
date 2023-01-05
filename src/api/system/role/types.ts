// 角色对象
export interface SysRole {
  roleId: number
  roleName: string
  roleKey: string
  dataScope: string
  sort: number
  status: string
  createTime: Date
  updateTime: Date
}

// 角色表单对象
export interface SysRoleForm {
  roleId: number
  roleName: string
  roleKey: string
  sort: number
  status: string
}

// 角色查询参数
export interface SysRoleQuery extends PageQuery {
  roleId: number
  roleName: string
  status: string
  createTime: Date
}
