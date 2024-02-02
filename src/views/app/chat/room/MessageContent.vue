<template>
  <div v-if="isObjectString(item.content)">
    <el-image
      v-if="content.type.startsWith('image/')"
      class="message-image"
      :src="$path(content.filePath)"
      :preview-src-list="[$path(content.filePath)]"
      fit="cover"
    />
    <div
      v-else
      :href="$path(content.filePath)"
      target="_blank"
      class="inline-flex"
      style="width: 200px; height: 50px;"
    >
      <svg-icon :name="getIconForFile(content.name)?.split('.')[0]" size="3em" />
      <div class="ml-5">
        <span class="block">{{ content.name }}</span>
        <span class="block" style="font-size: 12px; color: #a1a1a1">{{ getSize(content.size) }}</span>
      </div>
    </div>
  </div>
  <div
    v-else
    class="message"
    v-html="item.content"
  />
</template>

<script lang="ts" setup>
import { getIconForFile } from 'vscode-icons-ts'
import { AppChatMessage } from '@/api/app/chat/message/types'
import { FileMessageContent } from '@/types'
import { getSize } from '@/utils/byte'
import { isObjectString } from '@/utils/object'

const props = defineProps<{
  item: AppChatMessage,
}>()

const content = isObjectString(props.item.content) ? JSON.parse(props.item.content) as FileMessageContent : {} as FileMessageContent
</script>

<style lang="scss" scoped>
.message-image {
  height: 120px;
  display: block;
  border-radius: 10px;
}

.message {
  display: flex;
  align-items: center;
  padding: 6px;
  border-radius: 10px;

  &:hover {
    background-color: var(--chat-message-hover-background);
  }
}

.el-link {
  justify-content: start;
}
</style>
