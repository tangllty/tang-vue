<template>
  <el-scrollbar ref="scrollbarRef">
    <div ref="innerRef">
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
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref, toRefs } from 'vue'
import { ElScrollbar } from 'element-plus'
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
    pageSize: 10
  } as AppChatMessageQuery,
  chatMessageList: [] as AppChatMessage[]
})

const {
  queryParams,
  chatMessageList
} = toRefs(state)

const innerRef = ref<HTMLDivElement>()
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

const handleList = async (chatListId: number, scroll: boolean = false) => {
  state.queryParams.chatListId = chatListId
  const res: any = await listAppChatMessage(state.queryParams)
  state.chatMessageList = res.rows
  if (scroll) {
    scrollToBottom(false)
  }
}

const handleSentMessage = (message: AppChatMessage) => {
  state.chatMessageList.push(message)
  scrollToBottom()
}

// 将滚动条滚动到底部
const scrollToBottom = (animation: boolean = true) => {
  nextTick(() => {
    if (!scrollbarRef.value || !innerRef.value) return
    if (!animation) {
      scrollbarRef.value.scrollTo(0, innerRef.value.clientHeight)
      return
    }
    scrollbarRef.value.scrollTo({
      top: innerRef.value.clientHeight,
      behavior: 'smooth'
    })
  })
}

onMounted(() => {
  proxy.$socket.subscribe(MessageType.CHAT_MESSAGE, (chatMessage: string) => {
    const { chatListId, senderId, avatar, content } = JSON.parse(chatMessage) as ChatMessage
    const appChatMessage: AppChatMessage = {
      chatListId,
      senderId,
      avatar,
      content
    } as AppChatMessage
    handleSentMessage(appChatMessage)
  })
})

defineExpose({
  handleList,
  handleSentMessage,
  scrollToBottom
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
