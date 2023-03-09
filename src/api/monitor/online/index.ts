import request from '@/utils/request'
import { OnlineUserQuery } from './types'

// 查询在线用户列表
export const listOnlineUser = (queryParams: OnlineUserQuery) => {
  return request({
    url: '/monitor/online/list',
    method: 'get',
    params: queryParams
  })
}

// 查询在线用户信息
export const getOnlineUser = (token: string) => {
  return request({
    url: '/monitor/online/' + token,
    method: 'get'
  })
}

// 删除在线用户信息
export const deleteOnlineUser = (token: string) => {
  return request({
    url: '/monitor/online/' + token,
    method: 'delete'
  })
}
