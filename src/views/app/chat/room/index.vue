<template>
  <div class="chat-web">
    <!-- 侧边栏 -->
    <div class="chat-web__sidebar">
      <el-card>
        <SearchBar />
        <ChatList ref="chatListRef" @clicked="handleItemClick" />
      </el-card>
    </div>

    <!-- 聊天页面 -->
    <div class="chat-web__chat">
      <el-card>
        <div class="chat-container">
          <div class="chat-header">
            <ChatHeader :selectedItem="selectedItem" />
          </div>
          <div class="chat-content">
            <ChatMessage ref="chatMessageRef" />
          </div>
          <div class="chat-input">
            <MessageInput :selectedItem="selectedItem" @sendMessage="handleSendMessage" />
          </div>
        </div>

        <!-- 抽屉 -->
        <div v-if="showDrawer" class="drawer">
          <div class="drawer-header">
            <!-- 抽屉头部 -->
            <div class="title">设置</div>
            <div class="close-icon" @click="closeDrawer">
              <el-icon>
                <Close />
              </el-icon>
            </div>
          </div>
          <div class="drawer-content">
            <!-- 抽屉内容 -->
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { AppChatList } from '@/api/app/chat/chat-list/types'
import { AppChatMessage } from '@/api/app/chat/message/types'
import SearchBar from './SearchBar.vue'
import ChatList from './ChatList.vue'
import ChatHeader from './ChatHeader.vue'
import ChatMessage from './ChatMessage.vue'
import MessageInput from './MessageInput.vue'

const proxy = getProxy()

const state = reactive({
  selectedItem: null as (AppChatList | null),
  showDrawer: false,
})

const {
  selectedItem,
  showDrawer
} = toRefs(state)

const chatListRef = ref<InstanceType<typeof ChatList>>()
const chatMessageRef = ref<InstanceType<typeof ChatMessage>>()

const handleItemClick = (item: AppChatList): void => {
  state.selectedItem = item
  chatMessageRef.value?.handleList(item.chatListId)
}

const handleSendMessage = (sentMessage: AppChatMessage): void => {
  chatMessageRef.value?.handleSentMessage(sentMessage)
}

const toggleDrawer = (): void => {
  state.showDrawer = !state.showDrawer
}

const closeDrawer = (): void => {
  state.showDrawer = false
}

onMounted(() => {
  chatListRef.value?.handleChatList()
})
</script>

<style lang="scss" scoped>
.chat-web {
  display: flex;
  width: 100%;
  height: 100%;

  &__sidebar {
    width: 32%;
    max-width: 500px;

    .el-card {
      height: 100%;
    }
  }

  &__chat {
    margin-left: 15px;
    width: 100%;

    .el-card {
      height: 100%;

      .chat-container {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 130px);

        .chat-header {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .chat-content {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
        }
      }

      .chat-input {
        height: 200px;
        padding: 0 15px;
        box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
