import request from '@/utils/request'
import { AppFriendApplyQuery, AppFriendApplyForm } from './types'
import { SysUserFuzzyQuery } from '@/api/system/user/types'

// 查询用户好友申请列表
export const listAppFriendApply = (queryParams: AppFriendApplyQuery) => {
  return request({
    url: '/app/chat/friend-apply/list',
    method: 'get',
    params: queryParams
  })
}

// 模糊查询用户列表
export const listUserFuzzy = (queryParams: SysUserFuzzyQuery) => {
  return request({
    url: '/app/chat/friend-apply/list-fuzzy',
    method: 'get',
    params: queryParams
  })
}

// 查询用户好友申请信息
export const getAppFriendApply = (applyId: number) => {
  return request({
    url: '/app/chat/friend-apply/' + applyId,
    method: 'get'
  })
}

// 添加用户好友申请信息
export const addAppFriendApply = (data: AppFriendApplyForm) => {
  return request({
    url: '/app/chat/friend-apply',
    method: 'post',
    data
  })
}

// 修改用户好友申请信息
export const editAppFriendApply = (data: AppFriendApplyForm) => {
  return request({
    url: '/app/chat/friend-apply',
    method: 'put',
    data
  })
}

// 同意好友申请
export const acceptAppFriendApply = (uniqueId: number) => {
  return request({
    url: '/app/chat/friend-apply/accept/' + uniqueId,
    method: 'put'
  })
}

// 拒绝好友申请
export const declineAppFriendApply = (uniqueId: number) => {
  return request({
    url: '/app/chat/friend-apply/decline/' + uniqueId,
    method: 'put'
  })
}

// 删除用户好友申请信息
export const deleteAppFriendApply = (applyId: number) => {
  return request({
    url: '/app/chat/friend-apply/' + applyId,
    method: 'delete'
  })
}

// 批量删除用户好友申请信息
export const deleteAppFriendApplys = (applyIds: number[]) => {
  return request({
    url: '/app/chat/friend-apply',
    method: 'delete',
    data: applyIds
  })
}
