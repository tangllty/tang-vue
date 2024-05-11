export {}

declare global {

  /**
   * 分页查询参数
   */
  interface PageQuery {
    pageNum: number
    pageSize: number
    orderByColumn?: string
    isAsc?: string
    reasonable?: boolean
  }

  /**
   * 对话框参数
   */
  type Dialog = {
    title: string
    type: string
    visible: boolean
  }

  /**
   * 树形结构参数
   */
  type Tree = {
    value: number | string
    label: string
    children: Tree[]
  }

  /**
   * 树形选择结构参数
   */
  type TreeSelect = {
    value: number | string
    label: string
    checked: boolean
    children: TreeSelect[]
  }

  type SortData = {
    column: any
    prop: string
    order?: string
  }

}
