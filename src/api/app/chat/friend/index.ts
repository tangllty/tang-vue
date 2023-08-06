import request from '@/utils/request'
import { AppFriendQuery, AppFriendForm } from './types'

// 查询用户好友列表
export const listAppFriend = (queryParams: AppFriendQuery) => {
  return request({
    url: '/app/chat/friend/list',
    method: 'get',
    params: queryParams
  })
}

// 查询用户好友信息
export const getAppFriend = (userFriendId: number) => {
  return request({
    url: '/app/chat/friend/' + userFriendId,
    method: 'get'
  })
}

// 添加用户好友信息
export const addAppFriend = (data: AppFriendForm) => {
  return request({
    url: '/app/chat/friend',
    method: 'post',
    data
  })
}

// 修改用户好友信息
export const editAppFriend = (data: AppFriendForm) => {
  return request({
    url: '/app/chat/friend',
    method: 'put',
    data
  })
}

// 删除用户好友信息
export const deleteAppFriend = (userFriendId: number) => {
  return request({
    url: '/app/chat/friend/' + userFriendId,
    method: 'delete'
  })
}

// 批量删除用户好友信息
export const deleteAppFriends = (userFriendIds: number[]) => {
  return request({
    url: '/app/chat/friend',
    method: 'delete',
    data: userFriendIds
  })
}
