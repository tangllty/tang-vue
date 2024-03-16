import request from '@/utils/request'
import type { SysLogLoginQuery, SysLogLoginForm } from './types'

// 查询登陆日志列表
export const listSysLogLogin = (queryParams: SysLogLoginQuery) => {
  return request({
    url: '/system/log/login/list',
    method: 'get',
    params: queryParams
  })
}

// 查询登陆日志信息
export const getSysLogLogin = (loginId: number) => {
  return request({
    url: '/system/log/login/' + loginId,
    method: 'get'
  })
}

// 添加登陆日志信息
export const addSysLogLogin = (data: SysLogLoginForm) => {
  return request({
    url: '/system/log/login',
    method: 'post',
    data
  })
}

// 修改登陆日志信息
export const editSysLogLogin = (data: SysLogLoginForm) => {
  return request({
    url: '/system/log/login',
    method: 'put',
    data
  })
}

// 删除登陆日志信息
export const deleteSysLogLogin = (loginId: number) => {
  return request({
    url: '/system/log/login/' + loginId,
    method: 'delete'
  })
}

// 批量删除登陆日志信息
export const deleteSysLogLogins = (loginIds: number[]) => {
  return request({
    url: '/system/log/login',
    method: 'delete',
    data: loginIds
  })
}
