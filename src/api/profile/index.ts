import request from '@/utils/request'
import { SysUserForm, SysUserPasswordForm } from '@/api/system/user/types'
import { SysLogLoginQuery } from '@/api/system/log/login/types'

// 修改用户信息并更新缓存
export const editUserInfo = (data: SysUserForm) => {
  return request({
    url: '/profile/edit-info',
    method: 'put',
    data
  })
}

// 修改用户密码
export const editUserPassword = (data: SysUserPasswordForm) => {
  return request({
    url: '/profile/edit-password',
    method: 'put',
    data
  })
}

// 获取用户登陆日志列表
export const listSysLogLoginByUser = (queryParams: SysLogLoginQuery) => {
  return request({
    url: '/profile/login-log',
    method: 'get',
    params: queryParams
  })
}
