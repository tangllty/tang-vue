<template>
  <template v-for="item in data">
    <span
      v-if="item.dataValue === value"
      :key="item.dataId"
      :class="item.cssClass"
    >
      {{ item.dataLabel }}
    </span>
  </template>
</template>

<script lang="ts" setup>
import type { SysDictData } from '@/api/system/dict/data/types'

defineProps({
  data: {
    type: Array<SysDictData>,
    required: true
  },
  value: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss" scoped>
</style>
