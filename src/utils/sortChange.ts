/**
 * 排序事件
 *
 * @param data        排序数据
 * @param queryParams 查询参数
 * @param handleList  查询方法
 */
export const sort = (data: SortData, queryParams: PageQuery, handleList: () => Promise<void>) => {
  queryParams.orderByColumn = data.prop
  queryParams.isAsc = data.order
  handleList()
}
