import type ChatList from './ChatList.vue'
import type ChatMessage from './ChatMessage.vue'
import type MessageInput from './MessageInput.vue'

export type ChatListInstance = InstanceType<typeof ChatList>
export type ChatMessageInstance = InstanceType<typeof ChatMessage>
export type MessageInputInstance = InstanceType<typeof MessageInput>
