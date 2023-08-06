// 聊天消息对象
export interface AppChatMessage {
  messageId: number
  chatListId: number
  senderId: number
  username: string
  nickname: string
  avatar: string
  content: string
  createBy: string
  updateBy: string
  remark: string
}

// 聊天消息表单对象
export interface AppChatMessageForm {
  messageId: number
  chatListId: number
  senderId: number
  content: string
  createBy: string
  updateBy: string
  remark: string
}

// 聊天消息查询参数
export interface AppChatMessageQuery extends PageQuery {
  messageId: number
  chatListId: number
  senderId: number
  content: string
  createBy: string
  updateBy: string
  remark: string
}
