<template>
  <template v-for="item in data">
    <el-tag
      v-if="item.dataValue === value"
      :key="item.dataId"
      :class="item.cssClass"
      :type="item.typeClass"
    >
      {{ item.dataLabel }}
    </el-tag>
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
