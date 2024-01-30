<template>
  <el-image
    v-if="item.content.match(regex.image)"
    class="message-image"
    :src="$path(item.content.match(regex.image)?.[1] || '')"
    fit="cover"
  />
  <el-link
    v-else-if="item.content.match(regex.file)"
    :href="$path(item.content.match(regex.file)?.[1] || '')"
    target="_blank"
  >
    <svg-icon :name="getIconForFile(item.content.match(regex.file)?.[1].split('/uploads/')[1] || '')?.split('.')[0]" />
    <span>{{ item.content.match(regex.file)?.[1] || '' }}</span>
  </el-link>
  <div
    v-else
    class="message"
    v-html="item.content"
  />
</template>

<script lang="ts" setup>
import { getIconForFile } from 'vscode-icons-ts'
import { AppChatMessage } from '@/api/app/chat/message/types'

defineProps<{
  item: AppChatMessage
}>()

const regex = {
  image: /<img\s+src="([^"]+)"/,
  file: /<file\s+src="([^"]+)"/,
}
</script>

<style lang="scss" scoped>
.message-image {
  height: 120px;
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
</style>
