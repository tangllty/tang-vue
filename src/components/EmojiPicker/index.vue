<template>
  <div ref="pickerRef" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Picker } from 'emoji-mart'
import data from '@emoji-mart/data'
import { getProxy } from '@/utils/getCurrentInstance'

const proxy = getProxy()

const pickerRef = ref<HTMLDivElement>()

onMounted(() => {
  if (!pickerRef.value) return
  pickerRef.value.appendChild(new Picker({
    data,
    locale: 'zh',
    onEmojiSelect: (emoji: any, event: Event) => {
      proxy.$emit('select', emoji, event)
    }
  }) as unknown as Node)
})
</script>

<style lang="scss" scoped>
</style>
