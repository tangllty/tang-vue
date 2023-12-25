import request from '@/utils/request'
import { GenTableForm, GenTableQuery } from './types'

// 查询代码生成列表
export const listGenTable = (queryParams: GenTableQuery) => {
  return request({
    url: '/tool/generator/list',
    method: 'get',
    params: queryParams
  })
}

// 查询表列表
export const listDatabaseTable = (queryParams: GenTableQuery) => {
  return request({
    url: '/tool/generator/table/list',
    method: 'get',
    params: queryParams
  })
}

// 查询代码生成信息
export const getGenTable = (typeId: number) => {
  return request({
    url: '/tool/generator/' + typeId,
    method: 'get'
  })
}

// 修改代码生成信息
export const editGenTable = (data: GenTableForm) => {
  return request({
    url: '/tool/generator',
    method: 'put',
    data
  })
}

// 删除代码生成信息
export const deleteGenTable = (typeId: number) => {
  return request({
    url: '/tool/generator/' + typeId,
    method: 'delete'
  })
}

// 批量删除代码生成信息
export const deleteGenTables = (typeIds: any) => {
  return request({
    url: '/tool/generator',
    method: 'delete',
    data: typeIds
  })
}

// 导入表信息
export const importTable = (data: any) => {
  return request({
    url: '/tool/generator/import',
    method: 'post',
    params: data
  })
}

// 代码预览
export const previewCode = (tableId: number) => {
  return request({
    url: '/tool/generator/preview/' + tableId,
    method: 'get'
  })
}

// 代码下载
export const downloadCode = (tableName: string) => {
  return request({
    url: '/tool/generator/download/' + tableName,
    method: 'get',
    responseType: 'blob'
  })
}

// 批量代码下载
export const downloadCodes = (tableNames: any) => {
  return request({
    url: '/tool/generator/downloads',
    method: 'get',
    params: tableNames,
    responseType: 'blob'
  })
}

// 执行 SQL
export const execute = (tableName: string) => {
  return request({
    url: '/tool/generator/execute/' + tableName,
    method: 'get'
  })
}

// 批量执行 SQL
export const executes = (tableNames: any) => {
  return request({
    url: '/tool/generator/executes',
    method: 'get',
    params: tableNames
  })
}
