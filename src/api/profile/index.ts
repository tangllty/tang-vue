import request from '@/utils/request'
import { encrypt } from '@/utils/crypt'
import type { UploadFile } from 'element-plus'
import type { SysUserForm, SysUserPasswordForm } from '@/api/system/user/types'
import type { SysLogLoginQuery } from '@/api/system/log/login/types'

// 修改用户信息并更新缓存
export const editUserInfo = (data: SysUserForm) => {
  return request({
    url: '/profile/edit-info',
    method: 'put',
    data
  })
}

// 修改用户密码
export const editUserPassword = async (passwordForm: SysUserPasswordForm) => {
  const data: SysUserPasswordForm = {
    ...passwordForm,
    oldPassword: await encrypt(passwordForm.oldPassword),
    newPassword: await encrypt(passwordForm.newPassword),
    confirmPassword: await encrypt(passwordForm.confirmPassword)
  }
  return request({
    url: '/profile/edit-password',
    method: 'put',
    data
  })
}

// 获取用户登陆日志列表
export const listLogLoginByUser = (queryParams: SysLogLoginQuery) => {
  return request({
    url: '/profile/login-log',
    method: 'get',
    params: queryParams
  })
}

// 修改用户头像
export const editUserAvatar = (avatar: UploadFile) => {
  const formData = new FormData()
  formData.append('avatar', avatar.raw as Blob)
  return request({
    url: '/profile/edit-avatar',
    method: 'put',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
