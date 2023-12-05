/**
 * 用户好友申请对象
 */
export interface AppFriendApply {
  applyId: number
  userId: number
  friendId: number
  requestorId: number
  uniqueId: bigint
  username: string
  nickname: string
  reason: string
  applyType: string
  status: string
  createBy: string
  updateBy: string
  remark: string
}

/**
 * 用户好友申请表单对象
 */
export interface AppFriendApplyForm {
  applyId: number
  userId: number
  friendId: number
  requestorId: number
  uniqueId: bigint
  reason: string
  applyType: string
  status: string
  createBy: string
  updateBy: string
  remark: string
  username: string
  nickname: string
  email: string
  phone: string
}

/**
 * 用户好友申请查询参数
 */
export interface AppFriendApplyQuery extends PageQuery {
  applyId: number
  userId: number
  friendId: number
  requestorId: number
  uniqueId: bigint
  reason: string
  applyType: string
  status: string
  createBy: string
  updateBy: string
  remark: string
}
