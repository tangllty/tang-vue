<template>
  <div class="input-container">
    <div class="toolbar">
      <el-button :icon="Picture" circle />
      <el-button :icon="Files" circle />
      <el-button
        type="primary"
        :disabled="!replyMessage"
        @click="handleCancelReply"
      >取消回复</el-button>
      <div
        v-if="replyMessage"
        class="ml-10"
        style="line-height: 32px;"
      >
        回复消息：<span
          style="
            display: inline-block;
            color: #6e6e6e;
            border-left: 1px solid #919191;
            background-color: aliceblue;
            padding: 0 10px;
          "
        >
          {{ replyMessage?.content }}
        </span>
      </div>
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
.input-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;

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
