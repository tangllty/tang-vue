<template>
  <template v-for="item in data">
    <span
      v-if="item.dataLabel === value"
      :key="item.dataId"
      :class="item.cssClass"
    >
      {{ item.dataValue }}
    </span>
  </template>
</template>

<script lang="ts" setup>
import { SysDictData } from '@/api/system/dict/data/types'

const props = defineProps({
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
