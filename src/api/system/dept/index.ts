import request from '@/utils/request'
import type { SysDeptQuery, SysDeptForm } from './types'

// 查询部门列表
export const listDept = (queryParams: SysDeptQuery) => {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: queryParams
  })
}

// 查询部门树
export const listDeptTree = () => {
  return request({
    url: '/system/dept/deptTree',
    method: 'get'
  })
}

// 查询部门信息
export const getDept = (deptId: number) => {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
  })
}

// 添加部门信息
export const addDept = (data: SysDeptForm) => {
  return request({
    url: '/system/dept',
    method: 'post',
    data
  })
}

// 修改部门信息
export const editDept = (data: SysDeptForm) => {
  return request({
    url: '/system/dept',
    method: 'put',
    data
  })
}

// 修改部门状态
export const changeStatus = (deptId: number, status: string) => {
  const data = {
    deptId,
    status
  }

  return request({
    url: '/system/dept/changeStatus',
    method: 'put',
    data
  })
}

// 删除部门信息
export const deleteDept = (deptId: number) => {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete'
  })
}
