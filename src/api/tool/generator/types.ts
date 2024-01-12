/**
 * 代码生成对象
 */
export interface GenTable {
  tableId: number
  tableName: string
  tableComment: string
  className: string
  packageName: string
  moduleName: string
  businessName: string
  classComment: string
  author: string
  parentMenuId: number
  languageType: string
  ormType: string
  createTime: Date
  updateTime: Date
}

/**
 * 代码生成字段对象
 */
export interface GenTableColumn {
  columnId: number
  tableId: number
  columnName: string
  columnComment: string
  columnType: string
  javaType: string
  javaField: string
  isPk: string
  isIncrement: string
  isRequired: string
  isInsert: string
  isEdit: string
  isList: string
  isQuery: string
  queryType: string
  htmlType: string
  dictType: string
  sort: string
  createTime: Date
  updateTime: Date
}

/**
 * 代码生成表单对象
 */
export interface GenTableForm {
  tableId: number
  tableName: string
  tableComment: string
  className: string
  packageName: string
  moduleName: string
  businessName: string
  classComment: string
  author: string
  parentMenuId: number
  languageType: string
  ormType: string
  remark: string
  tableColumnList: GenTableColumn[]
}

/**
 * 代码生成查询参数
 */
export interface GenTableQuery extends PageQuery {
  tableId: number
  tableName: string
  tableComment: string
  className: string
  createTime: Date
}
