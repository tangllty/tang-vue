import request from '@/utils/request'
import { LoginForm } from './types'

// 登陆
export const login = (data: LoginForm) => {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// 登出
export const logout = () => {
  return request({
    url: '/logout',
    method: 'delete'
  })
}

// 获取用户信息
export const getInfo = () => {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 获取路由信息
export const getRoutes = () => {
  return request({
    url: '/getRoutes',
    method: 'get'
  })
}

// 获取验证码
export const getCaptcha = () => {
  return request({
    url: '/captcha',
    method: 'get'
  })
}

