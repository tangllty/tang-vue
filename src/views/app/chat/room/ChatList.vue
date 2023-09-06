<template>
  <div class="chat-item">
    <el-dropdown
      trigger="contextmenu"
      v-for="item in chatList"
      :key="item.nickname"
      style="display: flex;"
    >
      <div @click="handleItemClick(item)" class="chat-item-wrapper" :class="{ 'active': selectedItem === item, 'stick': item.stickFlag === '1' }">
        <div class="chat-item-wrapper__avatar-wrapper">
          <el-avatar :src="proxy.$path(item.avatar)" />
        </div>
        <div class="chat-item-wrapper__content-wrapper">
          <div class="content-header">
            <el-text truncated>{{ item.nickname }}</el-text>
            <span class="time">{{ item.time }}</span>
          </div>
          <div class="content-body">
            <el-text truncated>{{ item.message }}</el-text>
            <el-badge v-if="item.unreadCount > 0" :value="item.unreadCount" />
          </div>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleStick(item)">{{ item.stickFlag === '0' ? '置顶' : '取消置顶' }}</el-dropdown-item>
          <el-dropdown-item>{{ true ? '隐藏' : '取消隐藏'}}</el-dropdown-item>
          <el-dropdown-item>{{ false ? '静音' : '取消静音'}}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { listAppChatListAll, stickAppChatList, unstickAppChatList } from '@/api/app/chat/chat-list'
import { AppChatList } from '@/api/app/chat/chat-list/types'

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

  const friendId: number = Number(proxy.$route.query.friendId)
  const item: AppChatList | undefined = state.chatList.find((item) => item.friendId === friendId)
  if (!item) return
  handleItemClick(item)
}

// 点击聊天列表
const handleItemClick = (item: AppChatList): void => {
  if (selectedItem.value === item) return
  selectedItem.value = item

  proxy.$router.push({
    query: {
      friendId: item.friendId
    }
  })

  proxy.$emit('clicked', selectedItem.value)
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
    display: flex;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;

    &:hover {
      background-color: #d5d3d2 !important;
    }

    &__avatar-wrapper {
      height: 55px;
      display: flex;
      align-items: center;
      margin-left: 8px;
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
          color: #999;
          text-align: right;
          min-width: 100px;
          width: 35%;
        }
      }

      .content-body {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .el-text {
          font-size: 13px;
          color: #999;
        }

        .el-badge {
          margin-left: 10px;
        }
      }
    }
  }

  &-wrapper.active {
    background-color: #c9c8c6 !important;
  }

  &-wrapper.stick {
    background-color: #e1dedd;
  }
}
</style>
