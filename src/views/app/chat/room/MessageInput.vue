<template>
  <div v-if="replyMessage" class="reply-message-container">
    <div class="reply-message-box">
      <el-button
        type="primary"
        size="small"
        plain
        text
        @click="proxy.$notImplemented"
      >定位</el-button>
      <div
        class="reply-message"
        v-html="replyMessage?.content"
      />
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
      <el-popover
        placement="top-start"
        trigger="click"
        width="auto"
        :popper-style="{ padding: '0px', borderRadius: '10px' }"
        @before-enter="getInputMessage().focus()"
        :hide-after="0"
      >
        <template #reference>
          <el-button ref="emojiButtonRef" circle>
            <svg-icon name="表情" size="1.2em" />
          </el-button>
        </template>
        <EmojiPicker @select="handleEmojiSelect" />
      </el-popover>
      <el-button
        :icon="Picture"
        circle
        @click="handleImage"
      />
      <el-button
        :icon="Files"
        circle
        @click="handleFile"
      />
    </div>
    <input
      ref="imageRef"
      type="file"
      multiple
      accept="image/*"
      class="hidden"
      @change="handleImageChange"
    />
    <input
      ref="fileRef"
      type="file"
      multiple
      accept="*/*"
      class="hidden"
      @change="handleFileChange"
    />
    <el-dialog
      v-model="imagePreviewDialogVisible"
      title="发送图片"
      :width="imagePreviewFiles.length > 1 ? '50%' : '30%'"
    >
      <div v-if="imagePreviewFiles.length === 1" class="flex flex-col items-center">
        <el-image :src="imagePreviewUrls[0]" style="width: 280px; height: 280px" />
        <div class="flex flex-col items-center mt-10" style="color: #8d8787;">
          <span>文件名：{{ imagePreviewFiles[0].name }}</span>
          <span>类型：{{ imagePreviewFiles[0].type }}</span>
          <span>大小{{ getSize(imagePreviewFiles[0].size) }}</span>
        </div>
      </div>
      <div v-else class="flex flex-col items-center">
        <el-carousel
          type="card"
          height="362px"
          style="width: 500px;"
        >
          <el-carousel-item v-for="(item, index) in imagePreviewFiles" :key="item.name">
            <el-image :src="imagePreviewUrls[index]" style="width: 280px; height: 280px" />
            <div class="flex flex-col items-center mt-10" style="color: #8d8787;">
              <span>文件名：{{ item.name }}</span>
              <span>类型：{{ item.type }}</span>
              <span>大小{{ getSize(item.size) }}</span>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <template #footer>
        <span v-if="imagePreviewFiles.length > 1" class="mr-12">总大小：{{ getSize(imagePreviewFiles.reduce((total, item) => total + item.size, 0)) }}</span>
        <el-button type="primary" @click="handleImageMessage">确 定</el-button>
        <el-button @click="closeImageMessage">取 消</el-button>
      </template>
    </el-dialog>
    <el-dialog
      v-model="filePreviewDialogVisible"
      title="发送文件"
      width="50%"
    >
      <el-table :data="previewFiles" style="width: 100%">
      <el-table-column
        prop="name"
        label="图标"
        width="60"
        align="center"
      >
        <template #default="scope">
          <svg-icon :name="getIconForFile(scope.row.name)?.split('.')[0]" size="2em" />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="文件名"
        show-overflow-tooltip
      />
      <el-table-column
        prop="type"
        label="类型"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column
        prop="size"
        label="大小"
        width="100"
        align="center"
      >
        <template #default="scope">
          <span>{{ getSize(scope.row.size) }}</span>
        </template>
      </el-table-column>
    </el-table>
      <template #footer>
        <span v-if="previewFiles.length > 1" class="mr-12">总大小：{{ getSize(previewFiles.reduce((total, item) => total + item.size, 0)) }}</span>
        <el-button type="primary" @click="handleFileMessage">确 定</el-button>
        <el-button @click="closeFileMessage">取 消</el-button>
      </template>
    </el-dialog>
    <div class="input-wrapper">
      <div
        ref="inputMessageRef"
        contenteditable="true"
        class="input-message"
        @input="handleInput"
        @keyup="handleKeyUp"
        @keydown="handleKeyDown"
        @keydown.left="handleKeyDownLeft"
        @keydown.right="handleKeyDownRight"
        @keydown.enter.exact.prevent="handleInputMessage"
      />
      <div
        v-if="atListVisible"
        class="at-list"
        :style="{ left: cursorPosition.x + 'px', top: cursorPosition.y + 20 + 'px' }"
      >
        <div
          v-for="(item, index) in atList"
          :key="item.id"
          :class="{'active': index === activeIndex}"
          @click="handleItemClick(item)"
        >{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ButtonInstance } from 'element-plus'
import { Files, Picture } from '@element-plus/icons-vue'
import { getIconForFile } from 'vscode-icons-ts'
import { useUserStore } from '@/store/modules/user'
import { getProxy } from '@/utils/getCurrentInstance'
import { addAppChatMessage } from '@/api/app/chat/message'
import type { AppChatMessage, AppChatMessageForm } from '@/api/app/chat/message/types'
import type { AppChatList } from '@/api/app/chat/chat-list/types'
import { MessageType } from '@/enums'
import { uploadFile } from '@/api/file'
import { getSize } from '@/utils/byte'

const proxy = getProxy()

const userStore = useUserStore()

const props = defineProps<{
  selectedItem: AppChatList | null
}>()

const atList = [
  {
    name: '糖猫猫',
    id: 1
  },
  {
    name: '猫猫糖',
    id: 2
  },
  {
    name: '糖猫猫猫',
    id: 3
  }
]

const state = reactive({
  appChatMessageForm: {} as AppChatMessageForm,
  replyMessage: null as AppChatMessage | null,
  cursorPosition: {
    x: 0,
    y: 0
  },
  cursorRange: undefined as Range | undefined,
  atListVisible: false,
  activeIndex: 0,
  imagePreviewFiles: [] as File[],
  previewFiles: [] as File[],
  imagePreviewUrls: [] as string[],
  imagePreviewDialogVisible: false,
  filePreviewDialogVisible: false
})

const {
  replyMessage,
  cursorPosition,
  cursorRange,
  atListVisible,
  activeIndex,
  imagePreviewFiles,
  previewFiles,
  imagePreviewUrls,
  imagePreviewDialogVisible,
  filePreviewDialogVisible
} = toRefs(state)

const imageRef = ref<HTMLInputElement>()
const fileRef = ref<HTMLInputElement>()
const inputMessageRef = ref<HTMLInputElement | null>(null)
const emojiButtonRef = ref<ButtonInstance>()

const handleInputMessage = async () => {
  if (!props.selectedItem) return
  state.appChatMessageForm.chatListId = props.selectedItem.chatListId
  state.appChatMessageForm.senderId = userStore.user.userId
  if (state.replyMessage) {
    state.appChatMessageForm.replyMessageId = state.replyMessage.messageId
    state.appChatMessageForm.replyMessage = state.replyMessage
  }
  const inputMessage = getInputMessage()
  state.appChatMessageForm.content = inputMessage.innerHTML
  const res = await addAppChatMessage(state.appChatMessageForm)
  proxy.$emit('sendMessage', res.data)
  res.data.userId = props.selectedItem.chatId
  proxy.$socket.sendMessage({ messageType: MessageType.CHAT_MESSAGE, data: res.data })
  inputMessage.innerHTML = ''
  state.appChatMessageForm = {} as AppChatMessageForm
  state.replyMessage = null
}

const handleImageMessage = async () => {
  state.previewFiles = imagePreviewFiles.value
  await handleFileMessage()
  closeImageMessage()
}

const handleFileMessage = async () => {
  previewFiles.value.forEach(async (file: File) => {
    if (!props.selectedItem) return
    state.appChatMessageForm.chatListId = props.selectedItem.chatListId
    state.appChatMessageForm.senderId = userStore.user.userId
    if (state.replyMessage) {
      state.appChatMessageForm.replyMessageId = state.replyMessage.messageId
      state.appChatMessageForm.replyMessage = state.replyMessage
    }
    const uploadRes = await uploadFile(file)
    const content = {
      name: file.name,
      type: file.type,
      size: file.size,
      filePath: uploadRes.data.filePath
    }
    state.appChatMessageForm.content = JSON.stringify(content)
    const res = await addAppChatMessage(state.appChatMessageForm)
    proxy.$emit('sendMessage', res.data)
    res.data.userId = props.selectedItem.chatId
    proxy.$socket.sendMessage({ messageType: MessageType.CHAT_MESSAGE, data: res.data })
    state.appChatMessageForm = {} as AppChatMessageForm
    state.replyMessage = null
  })
  closeFileMessage()
}

const closeImageMessage = () => {
  imagePreviewDialogVisible.value = false
  imagePreviewFiles.value = []
  imagePreviewUrls.value = []
}

const closeFileMessage = () => {
  filePreviewDialogVisible.value = false
  previewFiles.value = []
}

// 消息回复
const handleReply = (item: AppChatMessage): void => {
  state.replyMessage = item
}

// 取消回复
const handleCancelReply = (): void => {
  state.replyMessage = null
}

const handleImage = () => {
  const image = imageRef.value
  if (!image) return
  image.click()
}

const handleFile = () => {
  const file = fileRef.value
  if (!file) return
  file.click()
}

const handleImageChange = (event: Event) => {
  const files = getFiles(event)
  imagePreviewFiles.value = files
  imagePreviewUrls.value = imagePreviewFiles.value.map(item => URL.createObjectURL(item))
  imagePreviewDialogVisible.value = true
}

const handleFileChange = (event: Event) => {
  const files = getFiles(event)
  previewFiles.value = files
  filePreviewDialogVisible.value = true
}

const getFiles = (event: Event): File[] => {
  const input = event.target as HTMLInputElement
  if (!input.files) return []
  const files = []
  for (let index = 0; index < input.files.length; index++) {
    const element = input.files.item(index)
    files.push(element as File)
  }
  return files
}

/**
 * 设置光标位置
 *
 * @param node   节点
 * @param offset 偏移量
 */
const setCursorPosition = (node: Node, offset: number) => {
  const range = document.createRange()
  const selection = window.getSelection()
  range.setStart(node, offset)
  range.collapse(true)
  if (!selection) return
  selection.removeAllRanges()
  selection.addRange(range)
}

/**
 * emoji 选择
 */
const handleEmojiSelect = (emoji: { [key: string]: string }, event: Event) => {
  emojiButtonRef.value?.$el.click()
  const inputMessage = getInputMessage()
  const selection = window.getSelection()
  if (!selection) return
  const range = selection.getRangeAt(0)
  const startOffset = range.startOffset || 0
  const emojiNode = document.createTextNode(emoji.native)
  const innerHTML = inputMessage.innerHTML
  inputMessage.innerHTML = innerHTML.substring(0, startOffset) + emojiNode.textContent + innerHTML.substring(startOffset, innerHTML.length)
  setCursorPosition(inputMessage.firstChild as Node, startOffset + 2)
}

const handleCursor = () => {
  const cursorPosition = getCursorPosition()
  state.cursorPosition.x = cursorPosition.x
  state.cursorPosition.y = cursorPosition.y

  const range = window.getSelection()?.getRangeAt(0)
  state.cursorRange = range
}

// 获取光标的位置(x, y)
const getCursorPosition = (): { x: number, y: number } => {
  const selection = window.getSelection()
  if (selection) {
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    return {
      x: rect.left,
      y: rect.top
    }
  }
  throw new Error('getCursorPosition error')
}

// @功能
const handleAt = () => {
  handleCursor()
  state.atListVisible = true
}

const handleInput = (event: Event) => {
  const range = window.getSelection()?.getRangeAt(0)
  const inputMessage = getInputMessage()
  if (range?.startContainer.parentNode?.nodeName === 'SPAN') {
    const inputEvent = event as InputEvent
    inputEvent.preventDefault()
    inputMessage.appendChild(document.createTextNode(inputEvent.data || ''))
  }
}

const handleKeyUp = (e: KeyboardEvent) => {
  const selection = window.getSelection()
  if (!selection) return
  const range = selection.getRangeAt(0)
  const focusNode = selection.focusNode
  if (!focusNode) return

  if (e.key === '@') {
    handleAt()
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  const arrowDown = 'ArrowDown'
  const arrowUp = 'ArrowUp'

  if (e.key === arrowDown || e.key === arrowUp) {
    e.preventDefault()

    if (e.key === arrowDown && activeIndex.value < atList.length - 1) {
      activeIndex.value++
      return
    }

    if (e.key === arrowUp && activeIndex.value > 0) {
      activeIndex.value--
      return
    }
  }
}

// 光标左移逻辑，如果光标在 @xxx 后面或者光标在 @xxx 里面，那么光标移动到 @xxx 前面
const handleKeyDownLeft = (event: KeyboardEvent) => {
  const selection = window.getSelection()
  if (!selection) return false
  const range = selection.getRangeAt(0)
  const focusNode = selection.focusNode
  if (!focusNode) return false

  if (range.startContainer.nodeValue?.includes('@') && range.startOffset !== 0) {
    range.setStart(range.startContainer, 1)
    range.setEnd(range.startContainer, 1)
  }
  if (range.startOffset === 0 && range.startContainer.previousSibling?.nodeName === 'SPAN') {
    const firstChild = range.startContainer.previousSibling.firstChild
    if (!firstChild) return false
    range.setStart(firstChild, 1)
    range.setEnd(firstChild, 1)
  }
}

// 光标右移逻辑，如果光标在 @xxx 前面或者光标在 @xxx 里面，那么光标移动到 @xxx 后面
const handleKeyDownRight = (event: KeyboardEvent) => {
  const selection = window.getSelection()
  if (!selection) return false
  const range = selection.getRangeAt(0)
  const focusNode = selection.focusNode
  if (!focusNode) return false
  const startContainer = range.startContainer
  const offsetNumber = startContainer.textContent?.length
  if (!offsetNumber) return false

  if (range.startContainer.nodeValue?.includes('@') && range.startOffset !== offsetNumber) {
    range.setStart(startContainer,  offsetNumber - 1)
    range.setEnd(startContainer, offsetNumber - 1)
  } else if ((range.startOffset === range.startContainer.textContent?.length) && range.startContainer.nextSibling?.nodeName === 'SPAN') {
    const firstChild = range.startContainer.nextSibling.firstChild
    if (!firstChild) return false
    range.setStart(firstChild, offsetNumber - 1)
    range.setEnd(firstChild, offsetNumber - 1)
  }
}

// TODO make any to specific type
// @列表点击事件
const handleItemClick = (item: any) => {
  const selection = window.getSelection()
  if (!selection) return
  const range = selection.getRangeAt(0)
  const startOffset = cursorRange.value?.startOffset
  const startContainer = cursorRange.value?.startContainer
  if (!startOffset || !startContainer) return
  const inputMessage = getInputMessage()

  const text = startContainer.textContent || ''
  const startText = text.substring(0, startOffset - 1)
  const endText = text.substring(startOffset, text.length)
  const startNode = document.createTextNode(startText)
  const endNode = document.createTextNode(endText)

  const atNode = document.createElement('span')
  atNode.innerText = `@${item.name}`
  atNode.style.color = '#0087ff'
  atNode.addEventListener('click', handleAtClick)

  console.log(startContainer)

  if (inputMessage.parentNode) {
    inputMessage.appendChild(atNode)
    // 如果最后一个节点是文本节点，那么直接在后面插入
  } else if (inputMessage.lastChild?.isSameNode(startContainer)) {
    inputMessage.removeChild(startContainer)
    inputMessage.appendChild(startNode)
    inputMessage.appendChild(atNode)
    inputMessage.appendChild(endNode)
    range.setStart(endNode, 0)
    range.setEnd(endNode, 0)
  } else {
    const nextSibling = cursorRange.value?.startContainer.nextSibling ?? null
    inputMessage.removeChild(startContainer)
    inputMessage.insertBefore(startNode, nextSibling)
    inputMessage.insertBefore(atNode, nextSibling)
    inputMessage.insertBefore(endNode, nextSibling)
  }

  atListVisible.value = false
}

// @点击事件
const handleAtClick = () => {
  const selection = window.getSelection()
  if (!selection) return
  const range = selection.getRangeAt(0)
  const focusNode = selection.focusNode
  if (!focusNode) return
  console.log(range)
  range.setStart(focusNode, 0)
  range.setEnd(focusNode, range.startContainer.textContent?.length || 0)
}

const getInputMessage = (): HTMLElement => {
  return inputMessageRef.value as HTMLElement
}

defineExpose({
  handleReply
})
</script>

<style lang="scss" scoped>
.el-carousel__item {
  &:nth-child(2n) {
    background-color: #d6e2f3;
  }

  &:nth-child(2n + 1) {
    background-color: #dde2e9;
  }
}

.reply-message-container {
  margin-bottom: 5px;

  .reply-message-box {
    width: 80%;
    margin: 0 auto;
    background: var(--chat-message-input-background);
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
  background-color: var(--chat-message-input-background);

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

    .input-message {
      width: 100%;
      height: 100px;
      border: 1px solid #808080;
      background-color: var(--chat-message-input-background);
    }

    .at-list {
      width: 300px;
      border: 1px solid #cecece;
      position: fixed;
      z-index: 999;

      div {
        width: 100%;
        height: 30px;
        background-color: #fbfbfb;
        border-bottom: 1px solid #ebebeb;
        display: flex;
        align-items: center;

        &:hover {
          cursor: pointer;
          background-color: #eaeaea;
        }
      }

      div:last-child {
        border-bottom: none;
      }

      .active {
        background-color: #ebebeb;
      }
    }
  }
}
</style>
