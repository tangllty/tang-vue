import { EpPropMergeType } from 'element-plus/es/utils/vue/props/types'

/**
 * 字典数据对象
 */
export interface SysDictData {
  dataId: number
  dictType: string
  dataLabel: string
  dataValue: string
  cssClass: string
  typeClass: EpPropMergeType<StringConstructor, '' | 'success' | 'warning' | 'info' | 'danger', unknown>
  sort: number
  status: string
  createTime: Date
  updateTime: Date
}

/**
 * 字典数据表单对象
 */
export interface SysDictDataForm {
  dataId: number
  dictType: string
  dataLabel: string
  dataValue: string
  cssClass: string
  typeClass: string
  sort: number
  status: string
  remark: string
}

/**
 * 字典数据查询参数
 */
export interface SysDictDataQuery extends PageQuery {
  dataId: number
  dictType: string
  dataLabel: string
  dataValue: string
  status: string
  createTime: Date
}
