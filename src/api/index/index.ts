import request from '@/utils/request'

// 获取用户访问量
export const listUserVisit = () => {
  return request({
    url: '/index/user-visit',
    method: 'get'
  })
}

// 获取微信群二维码
export const getWeChat = () => {
  return request({
    url: '/index/get-wechat',
    method: 'get',
    responseType: 'arraybuffer'
  })
}
