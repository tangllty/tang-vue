import request from '@/utils/request'
import type { SurveyUserAnswerQuery, SurveyUserAnswerForm } from './types'

/**
 * 查询调查问卷用户答案列表
 *
 * @param queryParams 查询参数
 */
export const listSurveyUserAnswer = (queryParams: SurveyUserAnswerQuery) => {
  return request({
    url: '/survey/answer/list',
    method: 'get',
    params: queryParams
  })
}

/**
 * 查询调查问卷用户答案信息
 *
 * @param answerId 调查问卷用户答案主键
 */
export const getSurveyUserAnswer = (answerId: number) => {
  return request({
    url: '/survey/answer/' + answerId,
    method: 'get'
  })
}

/**
 * 添加调查问卷用户答案信息
 *
 * @param data 调查问卷用户答案信息
 */
export const addSurveyUserAnswer = (data: SurveyUserAnswerForm) => {
  return request({
    url: '/survey/answer',
    method: 'post',
    data
  })
}

/**
 * 修改调查问卷用户答案信息
 *
 * @param data 调查问卷用户答案信息
 */
export const editSurveyUserAnswer = (data: SurveyUserAnswerForm) => {
  return request({
    url: '/survey/answer',
    method: 'put',
    data
  })
}

/**
 * 删除调查问卷用户答案信息
 *
 * @param answerId 调查问卷用户答案主键
 */
export const deleteSurveyUserAnswer = (answerId: number) => {
  return request({
    url: '/survey/answer/' + answerId,
    method: 'delete'
  })
}

/**
 * 批量删除调查问卷用户答案信息
 *
 * @param answerIds 调查问卷用户答案主键数组
 */
export const deleteSurveyUserAnswers = (answerIds: number[]) => {
  return request({
    url: '/survey/answer',
    method: 'delete',
    data: answerIds
  })
}
