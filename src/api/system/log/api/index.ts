import request from '@/utils/request'
import { SysLogApiQuery, SysLogApiForm, SysLogApiAnalysis } from './types'

/**
 * 查询接口日志列表
 *
 * @param queryParams 查询参数
 */
export const listSysLogApi = (queryParams: SysLogApiQuery) => {
  return request({
    url: '/system/log/api/list',
    method: 'get',
    params: queryParams
  })
}

/**
 * 查询分析接口日志列表
 */
export const listSysLogApiAnalysis = (queryParams: SysLogApiAnalysis) => {
  return request({
    url: '/system/log/api/list-analysis',
    method: 'get',
    params: queryParams
  })
}

/**
 * 查询接口日志信息
 *
 * @param apiId 接口日志主键
 */
export const getSysLogApi = (apiId: number) => {
  return request({
    url: '/system/log/api/' + apiId,
    method: 'get'
  })
}

/**
 * 添加接口日志信息
 *
 * @param data 接口日志信息
 */
export const addSysLogApi = (data: SysLogApiForm) => {
  return request({
    url: '/system/log/api',
    method: 'post',
    data
  })
}

/**
 * 修改接口日志信息
 *
 * @param data 接口日志信息
 */
export const editSysLogApi = (data: SysLogApiForm) => {
  return request({
    url: '/system/log/api',
    method: 'put',
    data
  })
}

/**
 * 删除接口日志信息
 *
 * @param apiId 接口日志主键
 */
export const deleteSysLogApi = (apiId: number) => {
  return request({
    url: '/system/log/api/' + apiId,
    method: 'delete'
  })
}

/**
 * 批量删除接口日志信息
 *
 * @param apiIds 接口日志主键数组
 */
export const deleteSysLogApis = (apiIds: number[]) => {
  return request({
    url: '/system/log/api',
    method: 'delete',
    data: apiIds
  })
}
