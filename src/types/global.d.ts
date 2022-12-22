export {}

declare global {

  // 分页查询参数
  interface PageQuery {
    pageNum: number
    pageSize: number
  }

  // 对话框参数
  type Dialog = {
    title: string
    type: string
    visible: boolean
  }

}
