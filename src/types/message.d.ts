import { MessageType } from '@/enums'

// 消息对象
export type Message = {
  messageType: MessageType
  data: any
}
