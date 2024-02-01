<template>
  <div class="chat-item">
    <div
      v-for="item in chatList"
      :key="item.nickname"
      @click="handleItemClick(item)"
      @click.right.native="showContextMenu($event, item)"
      :class="{ 'active': selectedItem === item, 'stick': item.stickFlag === '1' }"
      class="chat-item-wrapper flex items-center"
    >
      <div class="chat-item-wrapper__avatar-wrapper flex items-center ml-8">
        <el-avatar :src="proxy.$path(item.avatar)" />
      </div>
      <div class="chat-item-wrapper__content-wrapper">
        <div class="content-header">
          <el-text truncated>{{ item.nickname }}</el-text>
          <span class="time">{{ item.time }}</span>
        </div>
        <div class="content-body">
          <div
            v-if="isObjectString(item.message)"
            class="text-truncate"
            v-html="(JSON.parse(item.message) as FileMessageContent ).name"
          />
          <div
            v-else
            class="text-truncate"
            v-html="item.message"
          />
          <el-badge
            v-if="item.unreadCount > 0"
            :value="item.unreadCount"
            class="ml-10"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { listAppChatListAll, stickAppChatList, unstickAppChatList } from '@/api/app/chat/chat-list'
import { AppChatList } from '@/api/app/chat/chat-list/types'
import { ContextMenuOptions, MenuItem } from '@/components/ContextMenu/types'
import { isObjectString } from '@/utils/object'
import { FileMessageContent } from '@/types'

const proxy = getProxy()

const state = reactive({
  chatList: [] as AppChatList[],
  selectedItem: null as (AppChatList | null),
})

const {
  chatList,
  selectedItem
} = toRefs(state)

// 获取聊天列表
const handleChatList = async () => {
  const res: any = await listAppChatListAll()
  state.chatList = res.data

  const chatId: number = Number(proxy.$route.query.chatId)
  const item: AppChatList | undefined = state.chatList.find((item) => item.chatId === chatId)
  if (!item) return
  handleItemClick(item)
}

// 点击聊天列表
const handleItemClick = (appChatList: AppChatList): void => {
  if (selectedItem.value === appChatList) return
  selectedItem.value = appChatList

  proxy.$router.push({
    query: {
      chatId: appChatList.chatId
    }
  })

  proxy.$emit('clicked', selectedItem.value)
}

const showContextMenu = (e: MouseEvent, appChatList: AppChatList) => {
  const items: MenuItem[] = [
    {
      label: appChatList.stickFlag === '0' ? '置顶' : '取消置顶',
      icon: appChatList.stickFlag === '0' ? '置顶' : '取消置顶',
      onClick: () => {
        handleStick(appChatList)
      }
    },
    {
      label: appChatList ? '隐藏' : '取消隐藏',
      onClick: () => {
        proxy.$notImplemented()
      }
    },
    {
      label: appChatList ? '静音' : '取消静音',
      onClick: () => {
        proxy.$notImplemented()
      }
    }
  ]
  const options: ContextMenuOptions = {
    items
  }
  proxy.$contextMenu(e, options)
}

// 置顶
const handleStick = async (appChatList: AppChatList): Promise<void> => {
  if (appChatList.stickFlag === '0') {
    await stickAppChatList(appChatList.chatListId)
  } else {
    await unstickAppChatList(appChatList.chatListId)
  }
  await handleChatList()
}

defineExpose({
  handleChatList
})
</script>

<style lang="scss" scoped>
.chat-item {
  max-height: calc(100vh - 182px);
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;

  .el-card {
    height: 100%;
  }

  &-wrapper {
    border-radius: 5px;
    cursor: pointer;
    width: 100%;

    &:hover {
      background-color: var(--chat-list-hover-background) !important;
    }

    &__avatar-wrapper {
      height: 55px;
    }

    &__content-wrapper {
      flex: 1;
      padding: 0 10px;
      width: 0;

      .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .el-text {
          font-size: 16px;
          font-weight: bold;
          width: 65%;
        }

        .time {
          font-size: 12px;
          color: var(--chat-list-text-color);
          text-align: right;
          min-width: 100px;
          width: 35%;
        }
      }

      .content-body {
        display: flex;
        justify-content: space-between;
        align-items: center;

        div {
          font-size: 13px;
          color: var(--chat-list-text-color);
        }
      }
    }
  }

  &-wrapper.active {
    background-color: var(--chat-list-active-background) !important;
  }

  &-wrapper.stick {
    background-color: var(--chat-list-sticky-background);
  }
}
</style>
