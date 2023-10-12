import { MessageType } from '@/enums'
import { AppChatMessage } from '@/api/app/chat/message/types'

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
  replyMessageId: number
  replyMessage: AppChatMessage
  avatar: string
  content: string
}
