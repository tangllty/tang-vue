import request from '@/utils/request'
import { SysUserForm } from './types'

export const list = () => {
  return request({
    url: '/system/user/list',
    method: 'get'
  })
}

export const getUser = (userId: number) => {
  return request({
    url: '/system/user/' + userId,
    method: 'get'
  })
}

export const add = (data: SysUserForm) => {
  return request({
    url: '/system/user',
    method: 'post',
    data
  })
}

export const edit = (data: SysUserForm) => {
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
