<template>
  <div class="input-container">
    <div class="toolbar">
      <el-button :icon="Picture" circle />
      <el-button :icon="Files" circle />
      <!-- 其他功能按钮 -->
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
import { AppChatMessageForm } from '@/api/app/chat/message/types'
import { AppChatList } from '@/api/app/chat/chat-list/types'
import { MessageType } from '@/enums'
import { ChatMessage } from '@/types'

const proxy = getProxy()

const userStore = useUserStore()

const props = defineProps<{
  selectedItem: AppChatList | null
}>()

const state = reactive({
  inputMessage: '',
  appChatMessageForm: {} as AppChatMessageForm
})

const {
  inputMessage,
  appChatMessageForm
} = toRefs(state)

const handleInputMessage = async () => {
  if (!props.selectedItem) return
  state.appChatMessageForm.chatListId = props.selectedItem.chatListId
  state.appChatMessageForm.senderId = userStore.user.userId
  state.appChatMessageForm.content = state.inputMessage
  await addAppChatMessage(state.appChatMessageForm)
  proxy.$emit('sendMessage', state.appChatMessageForm)
  const chatMessage: ChatMessage = {
    chatListId: props.selectedItem.chatListId,
    userId: props.selectedItem.friendId,
    senderId: userStore.user.userId,
    content: state.inputMessage
  }
  proxy.$socket.sendMessage({ messageType: MessageType.CHAT_MESSAGE, data: chatMessage })
  state.inputMessage = ''
}
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
