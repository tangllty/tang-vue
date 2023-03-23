import request from '@/utils/request'

// 查询服务监控信息
export function getInfo() {
  return request({
    url: '/monitor/server',
    method: 'get'
  })
}
