import request from '@/utils/request'

// 获取用户访问量
export const listUserVisit = () => {
  return request({
    url: '/index/user-visit',
    method: 'get'
  })
}

// 获取 Gitee 微信群二维码
export const getWechatGitee = () => {
  return request({
    url: '/index/get-wechat-gitee',
    method: 'get',
    responseType: 'arraybuffer'
  })
}

// 获取 Github 微信群二维码
export const getWechatGithub = () => {
  return request({
    url: '/index/get-wechat-github',
    method: 'get',
    responseType: 'arraybuffer'
  })
}
