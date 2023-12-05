/**
 * 字典类型对象
 */
export interface SysDictType {
  typeId: number
  typeName: string
  dictType: string
  status: string
  createTime: Date
  updateTime: Date
}

/**
 * 字典类型表单对象
 */
export interface SysDictTypeForm {
  typeId: number
  typeName: string
  dictType: string
  status: string
  remark: string
}

/**
 * 字典类型查询参数
 */
export interface SysDictTypeQuery extends PageQuery {
  typeId: number
  typeName: string
  dictType: string
  status: string
  createTime: Date
}
