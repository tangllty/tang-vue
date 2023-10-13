<template>
  <div v-if="replyMessage" class="reply-message-container">
    <div class="reply-message-box">
      <el-button
        type="primary"
        size="small"
        plain
        text
      >定位(未实装)</el-button>
      <div class="reply-message">
        {{ replyMessage?.content }}
      </div>
      <el-button
        type="danger"
        size="small"
        plain
        text
        @click="handleCancelReply"
      >取消回复</el-button>
    </div>
  </div>
  <div class="input-container">
    <div class="toolbar">
      <el-button :icon="Picture" circle />
      <el-button :icon="Files" circle />
    </div>
    <div class="input-wrapper">
      <el-input
        v-model="inputMessage"
        type="textarea"
        :rows="6"
        placeholder="请输入内容..."
        @keydown.enter.exact.prevent="handleInputMessage"
        @keydown.enter.shift.exact.prevent="inputMessage += '\n'"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { Files, Picture } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { getProxy } from '@/utils/getCurrentInstance'
import { addAppChatMessage } from '@/api/app/chat/message'
import { AppChatMessage, AppChatMessageForm } from '@/api/app/chat/message/types'
import { AppChatList } from '@/api/app/chat/chat-list/types'
import { MessageType } from '@/enums'

const proxy = getProxy()

const userStore = useUserStore()

const props = defineProps<{
  selectedItem: AppChatList | null
}>()

const state = reactive({
  inputMessage: '',
  appChatMessageForm: {} as AppChatMessageForm,
  replyMessage: null as AppChatMessage | null
})

const {
  inputMessage,
  replyMessage
} = toRefs(state)

const handleInputMessage = async () => {
  if (!props.selectedItem) return
  state.appChatMessageForm.chatListId = props.selectedItem.chatListId
  state.appChatMessageForm.senderId = userStore.user.userId
  if (state.replyMessage) {
    state.appChatMessageForm.replyMessageId = state.replyMessage.messageId
    state.appChatMessageForm.replyMessage = state.replyMessage
  }
  state.appChatMessageForm.content = state.inputMessage
  const res = await addAppChatMessage(state.appChatMessageForm)
  proxy.$emit('sendMessage', res.data)
  res.data.userId = props.selectedItem.friendId
  proxy.$socket.sendMessage({ messageType: MessageType.CHAT_MESSAGE, data: res.data })
  state.inputMessage = ''
  state.appChatMessageForm = {} as AppChatMessageForm
  state.replyMessage = null
}

// 消息回复
const handleReply = (item: AppChatMessage): void => {
  state.replyMessage = item
}

// 取消回复
const handleCancelReply = (): void => {
  state.replyMessage = null
}

defineExpose({
  handleReply
})
</script>

<style lang="scss" scoped>
.reply-message-container {
  margin-bottom: 5px;

  .reply-message-box {
    width: 80%;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .reply-message {
      margin-right: auto;
      margin-left: 10px;
    }
  }
}

.input-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: white;

  .toolbar {
    display: flex;
    margin: 10px 0;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;

    .el-input {
      flex: 1;
      width: 100%;
      height: 100%;
    }

    .el-button {
      border-radius: 4px;
    }
  }
}
</style>
