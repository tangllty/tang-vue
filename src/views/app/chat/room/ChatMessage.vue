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
        class="message-container mb-10"
      >
        <!-- 自己 -->
        <div v-if="item.senderId === userStore.user.userId" class="self-container">
          <div class="self-message">
            <div class="message-container">
              <div class="message-time">
                <el-icon>
                  <Clock />
                </el-icon>
                {{ item.createTime }}
              </div>
              <el-dropdown trigger="contextmenu">
                <div class="message-box">
                  <div
                    class="message"
                    v-html="item.content"
                    @mouseover="handleMouseOver"
                    @mouseout="handleMouseOut"
                  />
                </div>
                  <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleCopy(item.content)">复制</el-dropdown-item>
                    <el-dropdown-item @click="handleReply(item)">回复(正在实装)</el-dropdown-item>
                    <el-dropdown-item>转发(未实装)</el-dropdown-item>
                    <el-dropdown-item>多选(未实装)</el-dropdown-item>
                    <el-dropdown-item>删除(未实装)</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <div
                v-if="item.replyMessage"
                class="reply-message"
              >
                <div
                  class="message"
                  v-html="item.replyMessage.content"
                />
              </div>
            </div>
            <el-avatar :src="proxy.$path(item.avatar)" />
          </div>
        </div>
        <!-- 对方 -->
        <div v-else class="other-container">
          <div class="other-message">
            <el-avatar :src="proxy.$path(item.avatar)" />
            <div class="message-container">
              <div class="message-time">
                <el-icon>
                  <Clock />
                </el-icon>
                {{ item.createTime }}
              </div>
              <el-dropdown trigger="contextmenu">
                <div class="message-box">
                  <div
                    class="message"
                    v-html="item.content"
                    @mouseover="handleMouseOver"
                    @mouseout="handleMouseOut"
                  />
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleCopy(item.content)">复制</el-dropdown-item>
                    <el-dropdown-item @click="handleReply(item)">回复(正在实装)</el-dropdown-item>
                    <el-dropdown-item>转发(未实装)</el-dropdown-item>
                    <el-dropdown-item>多选(未实装)</el-dropdown-item>
                    <el-dropdown-item>删除(未实装)</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <div
                v-if="item.replyMessage"
                class="reply-message"
              >
                <div
                  class="message"
                  v-html="item.replyMessage.content"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref, toRefs } from 'vue'
import { ElScrollbar } from 'element-plus'
import { Clock } from '@element-plus/icons-vue'
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

// 复制
const handleCopy = async (content: string) => {
  await navigator.clipboard.writeText(content)
}

// 回复
const handleReply = (replyMessage: AppChatMessage) => {
  proxy.$emit('replyMessage', replyMessage)
}

// 鼠标移入
const handleMouseOver = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  if (target.nodeName === 'DIV') {
    const targetElement = target.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement
    targetElement.style.visibility = 'visible'
    return
  }

  if (target.nodeName === 'SPAN') {
    const targetElement = target.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement
    targetElement.style.visibility = 'visible'
    return
  }
}

// 鼠标移出
const handleMouseOut = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  if (target.nodeName === 'DIV') {
    const targetElement = target.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement
    targetElement.style.visibility = 'hidden'
    return
  }

  if (target.nodeName === 'SPAN') {
    const targetElement = target.parentElement?.parentElement?.parentElement?.parentElement?.children[0] as HTMLElement
    targetElement.style.visibility = 'hidden'
    return
  }
}

onMounted(() => {
  proxy.$socket.subscribe(MessageType.CHAT_MESSAGE, (chatMessage: string) => {
    const { chatListId, senderId, replyMessageId, replyMessage, avatar, content } = JSON.parse(chatMessage) as ChatMessage
    const appChatMessage: AppChatMessage = {
      chatListId,
      senderId,
      replyMessageId,
      replyMessage,
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

  .self-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;

    .self-message {
      display: flex;
      margin-right: 10px;

      .el-avatar {
        margin-left: 10px;
        margin-top: 10px;
      }

      .message-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .message-time {
          font-size: 10px;
          margin-bottom: 2px;
          visibility: hidden;
        }

        .message-box {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 2px;
          border-radius: 10px;
          background-color: #c9e7ff;

          .message {
            display: flex;
            align-items: center;
          }
        }

        .message-box::before {
          content: '';
          position: absolute;
          top: 17px;
          right: -5px;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 5px 0 5px 5px;
          border-color: transparent transparent transparent #c9e7ff;
        }

        .reply-message {
          display: flex;
          padding: 8px;
          border-radius: 10px;
          margin-top: 5px;
          background-color: #ffffff88;
        }
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

      .el-avatar {
        margin-right: 10px;
        margin-top: 10px;
      }

      .message-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .message-time {
          font-size: 10px;
          margin-bottom: 2px;
          visibility: hidden;
        }

        .message-box {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 2px;
          border-radius: 10px;
          background-color: #ffffff;

          .message {
            display: flex;
            align-items: center;
          }
        }

        .message-box::before {
          content: '';
          position: absolute;
          top: 17px;
          left: -5px;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 5px 5px 5px 0;
          border-color: transparent #ffffff transparent transparent;
        }

        .reply-message {
          display: flex;
          padding: 8px;
          border-radius: 10px;
          margin-top: 5px;
          background-color: #ffffff88;
        }
      }
    }
  }

  .message-box {
    .message {
      padding: 6px;
      border-radius: 10px;

      &:hover {
        background-color: #cfcfcf75;
      }
    }
  }
}
</style>
