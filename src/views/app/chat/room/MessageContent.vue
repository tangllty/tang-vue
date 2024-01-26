<template>
  <el-image
    v-if="item.content.indexOf('src') !== -1"
    class="message-image"
    :src="$path(item.content.substring(item.content.indexOf('src') + 5, item.content.length - 4))"
    fit="cover"
  />
  <div
    v-else
    class="message"
    v-html="item.content"
  />
</template>

<script lang="ts" setup>
import { AppChatMessage } from '@/api/app/chat/message/types'

defineProps<{
  item: AppChatMessage
}>()
</script>

<style lang="scss" scoped>
.message-image {
  width: 250px;
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
