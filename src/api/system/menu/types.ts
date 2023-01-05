// 菜单对象
export interface SysMenu {
  menuId: number
  parentId: number
  menuName: string
  orderNum: number
  path: string
  component: string
  query: string
  perms: string
  icon: string
  menuType: string
  isFrame: string
  isCache: string
  visible: string
  status: string
  createTime: Date
  updateTime: Date
  children: SysMenu[]
}

// 菜单表单对象
export interface SysMenuForm {
  menuId: number
  parentId: number
  menuName: string
  orderNum: number
  path: string
  component: string
  query: string
  perms: string
  icon: string
  menuType: string
  isFrame: string
  isCache: string
  visible: string
  status: string
}

// 菜单查询参数
export interface SysMenuQuery extends PageQuery {
  menuId: number
  parentId: number
  menuName: string
  status: string
  createTime: Date
}
