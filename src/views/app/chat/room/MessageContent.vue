<template>
  <el-image
    v-if="item.content.match(regex.image)"
    class="message-image"
    :src="$path(item.content.match(regex.image)?.[1] || '')"
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

const regex = {
  image: /<img\s+src="([^"]+)"/,
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
