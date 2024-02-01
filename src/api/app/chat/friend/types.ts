/**
 * 用户好友对象
 */
export interface AppFriend {
  userFriendId: number
  userId: number
  friendId: number
  uniqueId: number
  username: string
  nickname: string
  createBy: string
  updateBy: string
  remark: string
}

/**
 * 用户好友表单对象
 */
export interface AppFriendForm {
  userFriendId: number
  userId: number
  friendId: number
  uniqueId: number
  createBy: string
  updateBy: string
  remark: string
}

/**
 * 用户好友查询参数
 */
export interface AppFriendQuery extends PageQuery {
  userFriendId: number
  userId: number
  friendId: number
  uniqueId: number
  createBy: string
  updateBy: string
  remark: string
}
