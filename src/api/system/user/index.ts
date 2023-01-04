import request from '@/utils/request'
import { SysUserQuery, SysUserForm } from './types'

export const listUser = (queryParams: SysUserQuery) => {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: queryParams
  })
}

export const getUser = (userId: number) => {
  return request({
    url: '/system/user/' + userId,
    method: 'get'
  })
}

export const addUser = (data: SysUserForm) => {
  return request({
    url: '/system/user',
    method: 'post',
    data
  })
}

export const editUser = (data: SysUserForm) => {
  return request({
    url: '/system/user',
    method: 'put',
    data
  })
}

export const deleteUser = (userId: number) => {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}
