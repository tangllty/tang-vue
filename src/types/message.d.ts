import { MessageType } from '@/enums'

// 消息对象
export type Message = {
  messageType: MessageType
  data: any
}

// 聊天消息对象
export type ChatMessage = {
  chatListId: number
  userId: number
  senderId: number
  avatar: string
  content: string
}
