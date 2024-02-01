/**
 * 聊天列对象
 */
export interface AppChatList {
  chatListId: number
  userId: number
  chatId: number
  chatType: string
  username: string
  nickname: string
  name: string
  avatar: string
  message: string
  unreadCount: number
  time: string
  stickFlag: string
  displayFlag: string
  muteFlag: string
  createBy: string
  updateBy: string
  remark: string
}

/**
 * 聊天列表单对象
 */
export interface AppChatListForm {
  chatListId: number
  userId: number
  chatId: number
  chatType: string
  stickFlag: string
  displayFlag: string
  muteFlag: string
  createBy: string
  updateBy: string
  remark: string
}

/**
 * 聊天列查询参数
 */
export interface AppChatListQuery extends PageQuery {
  chatListId: number
  userId: number
  chatId: number
  chatType: string
  stickFlag: string
  displayFlag: string
  muteFlag: string
  createBy: string
  updateBy: string
  remark: string
}
