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

// 登出
export function logout() {
  return request({
    url: '/logout',
    method: 'delete'
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 获取路由信息
export function getRoutes() {
  return request({
    url: '/getRoutes',
    method: 'get'
  })
}
