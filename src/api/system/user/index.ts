import request from '@/utils/request'
import { SysUserQuery, SysUserForm } from './types'


// 查询用户列表
export const listUser = (queryParams: SysUserQuery) => {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: queryParams
  })
}
// 查询用户列表
export const getUser = (userId: number) => {
  return request({
    url: '/system/user/' + userId,
    method: 'get'
  })
}


// 添加用户信息
export const addUser = (data: SysUserForm) => {
  return request({
    url: '/system/user',
    method: 'post',
    data
  })
}

// 修改用户信息
export const editUser = (data: SysUserForm) => {
  return request({
    url: '/system/user',
    method: 'put',
    data
  })
}

// 删除用户信息
export const deleteUser = (userId: number) => {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}
