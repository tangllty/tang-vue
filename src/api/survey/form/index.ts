import request from '@/utils/request'
import type { SurveyFormQuery, SurveyFormForm } from './types'

/**
 * 查询调查问卷列表
 *
 * @param queryParams 查询参数
 */
export const listSurveyForm = (queryParams: SurveyFormQuery) => {
  return request({
    url: '/survey/form/list',
    method: 'get',
    params: queryParams
  })
}

/**
 * 查询调查问卷信息
 *
 * @param formId 调查问卷主键
 */
export const getSurveyForm = (formId: number) => {
  return request({
    url: '/survey/form/' + formId,
    method: 'get'
  })
}

/**
 * 添加调查问卷信息
 *
 * @param data 调查问卷信息
 */
export const addSurveyForm = (data: SurveyFormForm) => {
  return request({
    url: '/survey/form',
    method: 'post',
    data
  })
}

/**
 * 修改调查问卷信息
 *
 * @param data 调查问卷信息
 */
export const editSurveyForm = (data: SurveyFormForm) => {
  return request({
    url: '/survey/form',
    method: 'put',
    data
  })
}

/**
 * 发布调查问卷信息
 *
 * @param formId 调查问卷主键
 */
export const publishSurveyForm = (formId: number) => {
  return request({
    url: '/survey/form/publish/' + formId,
    method: 'put'
  })
}

/**
 * 删除调查问卷信息
 *
 * @param formId 调查问卷主键
 */
export const deleteSurveyForm = (formId: number) => {
  return request({
    url: '/survey/form/' + formId,
    method: 'delete'
  })
}

/**
 * 批量删除调查问卷信息
 *
 * @param formIds 调查问卷主键数组
 */
export const deleteSurveyForms = (formIds: number[]) => {
  return request({
    url: '/survey/form',
    method: 'delete',
    data: formIds
  })
}
