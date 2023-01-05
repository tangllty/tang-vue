// 部门对象
export interface SysDept {
  deptId: number
  parentId: number
  deptName: string
  orderNum: number
  status: string
  createTime: Date
  updateTime: Date
  children: SysDept[]
}

// 部门表单对象
export interface SysDeptForm {
  deptId: number
  parentId: number
  deptName: string
  orderNum: number
  status: string
}

// 部门查询参数
export interface SysDeptQuery extends PageQuery {
  deptId: number
  deptName: string
  status: string
  createTime: Date
}
