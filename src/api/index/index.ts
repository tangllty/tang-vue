import request from '@/utils/request'

// 获取用户访问量
export const listUserVisit = () => {
  return request({
    url: '/index/user-visit',
    method: 'get'
  })
}
