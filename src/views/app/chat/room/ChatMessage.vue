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
        class="message-container flex items-center mb-10"
      >
        <!-- 自己 -->
        <div v-if="item.senderId === userStore.user.userId" class="self-container flex flex-col items-end">
          <div class="self-message flex">
            <div class="message-container flex flex-col items-end">
              <div
                class="message-time"
                :style="{ visibility: item.timeVisible ? 'visible' : 'hidden' }"
              >
                <el-icon>
                  <Clock />
                </el-icon>
                {{ item.createTime }}
              </div>
              <div
                class="message-box"
                @mouseover="item.timeVisible = true"
                @mouseout="item.timeVisible = false"
                @click.right.native="handleContextMenu($event, item)"
              >
                <MessageContent :item="item" />
              </div>
              <div v-if="item.replyMessage" class="reply-message">
                <div class="message" v-html="item.replyMessage.content" />
              </div>
            </div>
            <div class="message-avatar">
              <el-avatar :src="proxy.$path(item.avatar)" />
            </div>
          </div>
        </div>
        <!-- 对方 -->
        <div v-else class="other-container flex flex-col items-start">
          <div class="other-message flex">
            <div class="message-avatar">
              <el-avatar :src="proxy.$path(item.avatar)" />
            </div>
            <div class="message-container flex flex-col items-start">
              <div
                class="message-time"
                :style="{ visibility: item.timeVisible ? 'visible' : 'hidden' }"
              >
                <el-icon>
                  <Clock />
                </el-icon>
                {{ item.createTime }}
              </div>
              <div
                class="message-box"
                @mouseover="item.timeVisible = true"
                @mouseout="item.timeVisible = false"
                @click.right.native="handleContextMenu($event, item)"
              >
                <MessageContent :item="item" />
              </div>
              <div v-if="item.replyMessage" class="reply-message">
                <div class="message" v-html="item.replyMessage.content" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import type { ScrollbarInstance } from 'element-plus'
import { Clock } from '@element-plus/icons-vue'
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'
import MessageContent from './MessageContent.vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { isObjectString } from '@/utils/object'
import { downloadUrl } from '@/utils/download'
import { useUserStore } from '@/store/modules/user'
import { MessageType } from '@/enums'
import type { ChatMessage, FileMessageContent } from '@/types'
import { listAppChatMessage, deleteAppChatMessage } from '@/api/app/chat/message'
import type { ContextMenuOptions, MenuItem } from '@/components/ContextMenu/types'
import type { AppChatMessage, AppChatMessageData, AppChatMessageQuery } from '@/api/app/chat/message/types'

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
  chatMessageList: [] as AppChatMessageData[]
})

const {
  showInfiniteLoading,
  chatMessageList
} = toRefs(state)

const innerRef = ref<HTMLDivElement>()
const scrollbarRef = ref<ScrollbarInstance>()

/**
 * 加载更多
 */
const loadMore = async () => {
  if (!innerRef.value) return
  state.queryParams.pageNum = ++state.pageNum
  const { rows }: any = await listAppChatMessage(state.queryParams)
  rows.forEach((item: AppChatMessageData) => item.timeVisible = false)
  state.chatMessageList = [...rows, ...state.chatMessageList]

  // 滚动条滚动到原来的位置
  const currentHeight = innerRef.value.clientHeight
  nextTick(() => {
    if (!innerRef.value) return
    const newHeight = innerRef.value.clientHeight
    scrollbarRef.value?.scrollTo(0, newHeight - currentHeight)
  })
  state.showInfiniteLoading = rows.length === state.queryParams.pageSize
}

/**
 * 获取聊天消息列表
 *
 * @param chatListId 当前聊天列表id
 * @param scroll 是否滚动到底部
 */
const handleList = async (chatListId: number, scroll: boolean = false) => {
  state.queryParams.chatListId = chatListId
  state.queryParams.pageNum = 1
  const { rows }: any = await listAppChatMessage(state.queryParams)
  rows.forEach((item: AppChatMessageData) => item.timeVisible = false)
  state.chatMessageList = rows
  if (scroll) {
    scrollToBottom(false)
  }
  state.showInfiniteLoading = rows.length === state.queryParams.pageSize
}

/**
 * 处理发送的消息
 */
const handleSentMessage = (message: AppChatMessage) => {
  state.chatMessageList.push({ ...message, timeVisible: false })
  scrollToBottom()
}

/**
 * 将滚动条滚动到底部
 *
 * @param animation 是否使用动画
 */
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

/**
 * 消息右键菜单
 */
const handleContextMenu = (e: MouseEvent, appChatMessage: AppChatMessage) => {
  const content = isObjectString(appChatMessage.content) ? JSON.parse(appChatMessage.content) as FileMessageContent : {} as FileMessageContent

  const items: MenuItem[] = [
    {
      label: '下载',
      visible: !!content.type,
      onClick: () => downloadUrl(content.filePath, content.name)
    },
    {
      label: '复制',
      onClick: () => {
        handleCopy(appChatMessage.content)
      }
    },
    {
      label: '回复',
      onClick: () => {
        handleReply(appChatMessage)
      }
    },
    {
      label: '转发',
      onClick: () => {
        proxy.$notImplemented()
      }
    },
    {
      label: '多选',
      onClick: () => {
        proxy.$notImplemented()
      }
    },
    {
      label: '删除',
      onClick: () => {
        handleDelete(appChatMessage)
      }
    }
  ]
  const options: ContextMenuOptions = {
    items
  }
  proxy.$contextMenu(e, options)
}

/**
 * 复制
 */
const handleCopy = async (content: string) => {
  await navigator.clipboard.writeText(content)
}

/**
 * 回复
 */
const handleReply = (replyMessage: AppChatMessage) => {
  proxy.$emit('replyMessage', replyMessage)
}

/**
 * 删除
 */
const handleDelete = async (appChatMessage: AppChatMessage) => {
  await deleteAppChatMessage(appChatMessage.messageId)
  state.chatMessageList = state.chatMessageList.filter(item => item.messageId !== appChatMessage.messageId)
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
  --message-margin: 50px;

  .self-container {
    width: 100%;

    .self-message {
      margin-right: 10px;
      margin-left: var(--message-margin);

      .message-avatar {
        margin-left: 10px;
        margin-top: 10px;
      }

      .message-box {
        background-color: var(--chat-message-box-self-background);
      }

      .message-box::before {
        right: -5px;
        border-width: 5px 0 5px 5px;
        border-color: transparent transparent transparent var(--chat-message-box-self-background);
      }
    }
  }

  .other-container {
    width: 100%;

    .other-message {
      margin-right: var(--message-margin);

      .message-avatar {
        margin-right: 10px;
        margin-top: 10px;
      }

      .message-box {
        background-color: var(--chat-message-box-other-background);
      }

      .message-box::before {
        left: -5px;
        border-width: 5px 5px 5px 0;
        border-color: transparent var(--chat-message-box-other-background) transparent transparent;
      }
    }
  }

  .message-time {
    font-size: 10px;
    margin-bottom: 2px;
    visibility: hidden;
  }

  .message-box {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 2px;
    border-radius: 10px;
  }

  .message-box::before {
    content: '';
    position: absolute;
    top: 17px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
  }

  .reply-message {
    display: flex;
    padding: 8px;
    border-radius: 10px;
    margin-top: 5px;
    background-color: var(--chat-message-box-reply-background);
  }
}
</style>
