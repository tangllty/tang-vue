<template>
  <el-scrollbar ref="scrollbarRef">
    <div ref="innerRef">
      <InfiniteLoading
        v-if="showInfiniteLoading"
        @infinite="loadMore"
        spinner="spiral"
        direction="top"
        force-use-infinite-wrapper
      />
      <div
        v-for="item in chatMessageList"
        :key="item.messageId"
        class="message-container"
      >
        <!-- 自己 -->
        <div v-if="item.senderId === userStore.user.userId" class="self-container">
          <div class="self-message">
            <span class="self-message">
              <span class="message">
                {{ item.content }}
              </span>
            </span>
            <el-avatar :src="proxy.$path(item.avatar)" />
          </div>
        </div>
        <!-- 对方 -->
        <div v-else class="other-container">
          <div class="other-message">
            <el-avatar :src="proxy.$path(item.avatar)" />
            <span class="other-message">
              <span class="message">
                {{ item.content }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref, toRefs } from 'vue'
import { ElScrollbar } from 'element-plus'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'
import { useUserStore } from '@/store/modules/user'
import { getProxy } from '@/utils/getCurrentInstance'
import { listAppChatMessage } from '@/api/app/chat/message'
import { AppChatMessage, AppChatMessageQuery } from '@/api/app/chat/message/types'
import { MessageType } from '@/enums'
import { ChatMessage } from '@/types'

const proxy = getProxy()

const userStore = useUserStore()

const state = reactive({
  pageNum: 1,
  showInfiniteLoading: false,
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    reasonable: false
  } as AppChatMessageQuery,
  chatMessageList: [] as AppChatMessage[]
})

const {
  showInfiniteLoading,
  chatMessageList
} = toRefs(state)

const innerRef = ref<HTMLDivElement>()
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

// 加载更多
const loadMore = async () => {
  if (!innerRef.value) return
  state.queryParams.pageNum = ++state.pageNum
  state.queryParams.chatListId = state.queryParams.chatListId
  const res: any = await listAppChatMessage(state.queryParams)
  state.chatMessageList = [...res.rows, ...state.chatMessageList]

  // 滚动条滚动到原来的位置
  const currentHeight = innerRef.value.clientHeight
  nextTick(() => {
    if (!innerRef.value) return
    const newHeight = innerRef.value.clientHeight
    scrollbarRef.value?.scrollTo(0, newHeight - currentHeight)
  })
  state.showInfiniteLoading = res.rows.length === state.queryParams.pageSize
}

// 获取聊天消息列表
const handleList = async (chatListId: number, scroll: boolean = false) => {
  state.queryParams.chatListId = chatListId
  state.queryParams.pageNum = 1
  const res: any = await listAppChatMessage(state.queryParams)
  state.chatMessageList = res.rows
  if (scroll) {
    scrollToBottom(false)
  }
  state.showInfiniteLoading = res.rows.length === state.queryParams.pageSize
}

// 处理发送的消息
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
        background-color: #d5f5e2;
        border-radius: 10px;
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

      .el-avatar {
        margin-right: 10px;
      }

      .other-message {
        margin-left: 10px;
        background-color: #ffffff;
        border-radius: 10px;
      }
    }
  }

  .message {
    padding: 10px;
    border-radius: 10px;

    &:hover {
      background-color: #cfcfcf75 !important;
    }
  }
}
</style>
