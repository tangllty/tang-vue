import request from '@/utils/request'
import { SysMenuQuery, SysMenuForm } from './types'

export const listMenu = (queryParams: SysMenuQuery) => {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params: queryParams
  })
}

export const menuTree = () => {
  return request({
    url: '/system/menu/menuTree',
    method: 'get'
  })
}

export const getMenu = (menuId: number) => {
  return request({
    url: '/system/menu/' + menuId,
    method: 'get'
  })
}

export const addMenu = (data: SysMenuForm) => {
  return request({
    url: '/system/menu',
    method: 'post',
    data
  })
}

export const editMenu = (data: SysMenuForm) => {
  return request({
    url: '/system/menu',
    method: 'put',
    data
  })
}

export const deleteMenu = (menuId: number) => {
  return request({
    url: '/system/menu/' + menuId,
    method: 'delete'
  })
}
