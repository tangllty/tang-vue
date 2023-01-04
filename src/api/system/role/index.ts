import request from '@/utils/request'
import { SysRoleForm, SysRoleQuery } from './types'

export const listRole = (queryParams: SysRoleQuery) => {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: queryParams
  })
}

export const getRole = (roleId: number) => {
  return request({
    url: '/system/role/' + roleId,
    method: 'get'
  })
}

export const addRole = (data: SysRoleForm) => {
  return request({
    url: '/system/role',
    method: 'post',
    data
  })
}

export const editRole = (data: SysRoleForm) => {
  return request({
    url: '/system/role',
    method: 'put',
    data
  })
}

export const deleteRole = (roleId: number) => {
  return request({
    url: '/system/role/' + roleId,
    method: 'delete'
  })
}
