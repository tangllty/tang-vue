/**
 * 菜单对象
 */
export interface SysMenu {
  menuId: number
  parentId: number
  menuName: string
  path: string
  component: string
  perms: string
  icon: string
  menuType: string
  visible: string
  sort: number
  status: string
  createTime: Date
  updateTime: Date
  children: SysMenu[]
}

/**
 * 菜单表单对象
 */
export interface SysMenuForm {
  menuId: number
  parentId: number
  menuName: string
  path: string
  component: string
  permission: string
  icon: string
  menuType: string
  visible: string
  sort: number
  status: string
}

/**
 * 菜单查询参数
 */
export interface SysMenuQuery extends PageQuery {
  menuId: number
  parentId: number
  menuName: string
  menuType: string
  status: string
  createTime: Date
}
