import request from '@/utils/request'
import { SysMenuQuery, SysMenuForm } from './types'

// 查询菜单列表
export const listMenu = (queryParams: SysMenuQuery) => {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params: queryParams
  })
}

// 查询菜单树
export const listMenuTree = (queryParams = {} as SysMenuQuery) => {
  return request({
    url: '/system/menu/menuTree',
    method: 'get',
    params: queryParams
  })
}
// 查询菜单信息
export const getMenu = (menuId: number) => {
  return request({
    url: '/system/menu/' + menuId,
    method: 'get'
  })
}

// 添加菜单信息
export const addMenu = (data: SysMenuForm) => {
  return request({
    url: '/system/menu',
    method: 'post',
    data
  })
}

// 修改菜单信息
export const editMenu = (data: SysMenuForm) => {
  return request({
    url: '/system/menu',
    method: 'put',
    data
  })
}

// 修改菜单状态
export const changeStatus = (menuId: number, status: string) => {
  const data = {
    menuId,
    status
  }

  return request({
    url: '/system/menu/changeStatus',
    method: 'put',
    data
  })
}

// 删除菜单信息
export const deleteMenu = (menuId: number) => {
  return request({
    url: '/system/menu/' + menuId,
    method: 'delete'
  })
}
