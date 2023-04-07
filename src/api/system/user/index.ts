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

// 获取角色下拉框数据
export const getRoleSelect = () => {
  return request({
    url: '/system/user/getRoleSelect',
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

// 修改用户状态
export const changeStatus = (userId: number, status: string) => {
  const data = {
    userId,
    status
  }

  return request({
    url: '/system/user/changeStatus',
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

// 批量删除用户
export const deleteUsers = (userIds: number[]) => {
  return request({
    url: '/system/user',
    method: 'delete',
    data: userIds
  })
}

// 导出用户信息
export const exportUser = (queryParams: SysUserQuery) => {
  return request({
    url: '/system/user/export',
    method: 'get',
    params: queryParams,
    responseType: 'arraybuffer'
  })
}
