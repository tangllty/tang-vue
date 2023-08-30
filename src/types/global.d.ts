export {}

declare global {

  // 分页查询参数
  interface PageQuery {
    pageNum: number
    pageSize: number
    reasonable?: boolean
  }

  // 对话框参数
  type Dialog = {
    title: string
    type: string
    visible: boolean
  }

  // 树结构参数
  type TreeSelect = {
    value: number
    label: string
    checked: boolean
    children: TreeSelect[]
  }

}
