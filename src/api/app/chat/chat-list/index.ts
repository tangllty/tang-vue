import request from '@/utils/request'
import { AppChatListQuery, AppChatListForm } from './types'

// 查询聊天列列表
export const listAppChatList = (queryParams: AppChatListQuery) => {
  return request({
    url: '/app/chat/chat-list/list',
    method: 'get',
    params: queryParams
  })
}

// 查询当前用户聊天列表列表
export const listAppChatListAll = () => {
  return request({
    url: '/app/chat/chat-list/list-all',
    method: 'get'
  })
}

// 查询聊天列信息
export const getAppChatList = (chatListId: number) => {
  return request({
    url: '/app/chat/chat-list/' + chatListId,
    method: 'get'
  })
}

// 添加聊天列信息
export const addAppChatList = (data: AppChatListForm) => {
  return request({
    url: '/app/chat/chat-list',
    method: 'post',
    data
  })
}

// 修改聊天列信息
export const editAppChatList = (data: AppChatListForm) => {
  return request({
    url: '/app/chat/chat-list',
    method: 'put',
    data
  })
}

// 删除聊天列信息
export const deleteAppChatList = (chatListId: number) => {
  return request({
    url: '/app/chat/chat-list/' + chatListId,
    method: 'delete'
  })
}

// 批量删除聊天列信息
export const deleteAppChatLists = (chatListIds: number[]) => {
  return request({
    url: '/app/chat/chat-list',
    method: 'delete',
    data: chatListIds
  })
}
