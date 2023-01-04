import request from '@/utils/request'
import { SysDeptQuery, SysDeptForm } from './types'

export const listDept = (queryParams: SysDeptQuery) => {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: queryParams
  })
}

export const deptTree = () => {
  return request({
    url: '/system/dept/deptTree',
    method: 'get'
  })
}

export const getDept = (deptId: number) => {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
  })
}

export const addDept = (data: SysDeptForm) => {
  return request({
    url: '/system/dept',
    method: 'post',
    data
  })
}

export const editDept = (data: SysDeptForm) => {
  return request({
    url: '/system/dept',
    method: 'put',
    data
  })
}

export const deleteDept = (deptId: number) => {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete'
  })
}
