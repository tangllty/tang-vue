import request from '@/utils/request'

export const list = () => {
  return request({
    url: '/system/user/list',
    method: 'get'
  })
}
