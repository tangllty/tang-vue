import request from '@/utils/request'
import type { AppChatMessageQuery, AppChatMessageForm } from './types'

// 查询聊天消息列表
export const listAppChatMessage = (queryParams: AppChatMessageQuery) => {
  return request({
    url: '/app/chat/message/list',
    method: 'get',
    params: queryParams
  })
}

// 查询聊天消息信息
export const getAppChatMessage = (messageId: number) => {
  return request({
    url: '/app/chat/message/' + messageId,
    method: 'get'
  })
}

// 添加聊天消息信息
export const addAppChatMessage = (data: AppChatMessageForm) => {
  return request({
    url: '/app/chat/message',
    method: 'post',
    data
  })
}

// 修改聊天消息信息
export const editAppChatMessage = (data: AppChatMessageForm) => {
  return request({
    url: '/app/chat/message',
    method: 'put',
    data
  })
}

// 删除聊天消息信息
export const deleteAppChatMessage = (messageId: number) => {
  return request({
    url: '/app/chat/message/' + messageId,
    method: 'delete'
  })
}

// 批量删除聊天消息信息
export const deleteAppChatMessages = (messageIds: number[]) => {
  return request({
    url: '/app/chat/message',
    method: 'delete',
    data: messageIds
  })
}
