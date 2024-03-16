import request from '@/utils/request'
import type { SysDictTypeForm, SysDictTypeQuery } from './types'

// 查询字典类型列表
export const listDictType = (queryParams: SysDictTypeQuery) => {
  return request({
    url: '/system/dict/type/list',
    method: 'get',
    params: queryParams
  })
}

// 获取字典树下拉选项
export const listDictTree = () => {
  return request({
    url: '/system/dict/type/dict-tree',
    method: 'get'
  })
}

// 查询字典类型信息
export const getDictType = (typeId: number) => {
  return request({
    url: '/system/dict/type/' + typeId,
    method: 'get'
  })
}

// 添加字典类型信息
export const addDictType = (data: SysDictTypeForm) => {
  return request({
    url: '/system/dict/type',
    method: 'post',
    data
  })
}

// 修改字典类型信息
export const editDictType = (data: SysDictTypeForm) => {
  return request({
    url: '/system/dict/type',
    method: 'put',
    data
  })
}

// 删除字典类型信息
export const deleteDictType = (typeId: number) => {
  return request({
    url: '/system/dict/type/' + typeId,
    method: 'delete'
  })
}

// 批量删除字典类型信息
export const deleteDictTypes = (typeIds: number[]) => {
  return request({
    url: '/system/dict/type',
    method: 'delete',
    data: typeIds
  })
}
