import request from '@/utils/request'
import { LoginForm } from './types'

// 登陆
export function login(data: LoginForm) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}