import request from '@/utils/request'
import type { SysDictDataForm, SysDictDataQuery } from './types'

// 查询字典数据列表
export const listDictData = (queryParams: SysDictDataQuery) => {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: queryParams
  })
}

// 通过字典类型查询字典数据列表
export const selectDictDataListByDictType = (dictType: string) => {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  })
}

// 查询字典数据信息
export const getDictData = (dataId: number) => {
  return request({
    url: '/system/dict/data/' + dataId,
    method: 'get'
  })
}

// 添加字典数据信息
export const addDictData = (data: SysDictDataForm) => {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data
  })
}

// 修改字典数据信息
export const editDictData = (data: SysDictDataForm) => {
  return request({
    url: '/system/dict/data',
    method: 'put',
    data
  })
}

// 删除字典数据信息
export const deleteDictData = (dataId: number) => {
  return request({
    url: '/system/dict/data/' + dataId,
    method: 'delete'
  })
}

// 批量删除字典数据信息
export const deleteDictDatas = (dataIds: number[]) => {
  return request({
    url: '/system/dict/data',
    method: 'delete',
    data: dataIds
  })
}
