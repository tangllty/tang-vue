<template>
  <div
    v-for="item in chatMessageList"
    :key="item.messageId"
    class="message-container"
  >
    <!-- 自己 -->
    <div v-if="item.senderId === userStore.user.userId" class="self-container">
      <div class="self-message">
        <span class="self-message">{{ item.content }}</span>
        <el-avatar :src="proxy.$path(item.avatar)" />
      </div>
    </div>
    <!-- 对方 -->
    <div v-else class="other-container">
      <div class="other-message">
        <el-avatar :src="proxy.$path(item.avatar)" />
        <span class="other-message">{{ item.content }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, toRefs } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { getProxy } from '@/utils/getCurrentInstance'
import { listAppChatMessage } from '@/api/app/chat/message'
import { AppChatMessage, AppChatMessageQuery } from '@/api/app/chat/message/types'
import { MessageType } from '@/enums'
import { ChatMessage } from '@/types'

const proxy = getProxy()

const userStore = useUserStore()

const state = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 1000
  } as AppChatMessageQuery,
  chatMessageList: [] as AppChatMessage[]
})

const {
  queryParams,
  chatMessageList
} = toRefs(state)

const handleList = async (chatListId: number) => {
  state.queryParams.chatListId = chatListId
  const res: any = await listAppChatMessage(state.queryParams)
  state.chatMessageList = res.rows
}

const handleSendedMessage = (message: AppChatMessage) => {
  state.chatMessageList.push(message)
  scrollToBottom()
}

// 将滚动条滚动到底部
const scrollToBottom = (): void => {
  const el = document.querySelector('.chat-content')
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}

onMounted(() => {
  proxy.$socket.subscribe(MessageType.CHAT_MESSAGE, (chatMessage: string) => {
    const { chatListId, senderId, content } = JSON.parse(chatMessage) as ChatMessage
    const appChatMessage: AppChatMessage = {
      chatListId,
      senderId,
      content
    } as AppChatMessage
    state.chatMessageList.push(appChatMessage)
    scrollToBottom()
  })
})

defineExpose({
  handleList,
  handleSendedMessage
})
</script>

<style lang="scss" scoped>
.message-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .self-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;

    .self-message {
      display: flex;
      align-items: center;
      margin-right: 10px;

      .el-avatar {
        margin-left: 10px;
      }

      .self-message {
        margin-right: 10px;
        background-color: #e6f7ff;
        border-radius: 10px;
        padding: 10px;
      }
    }
  }

  .other-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;

    .other-message {
      display: flex;
      align-items: center;
      margin-left: 10px;

      .el-avatar {
        margin-right: 10px;
      }

      .other-message {
        margin-left: 10px;
        background-color: #e6f7ff;
        border-radius: 10px;
        padding: 10px;
      }
    }
  }
}
</style>
