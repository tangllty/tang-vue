<template>
  <el-form label-width="120px">
    <Render v-model="componentList" />

    <!-- TODO 确定&取消按钮 -->
  </el-form>
</template>

<script lang="ts" setup>
import type { Component } from '../../types'
import Render from './Render.vue'

const state = reactive({
  componentList: [] as Component[]
})

const {
  componentList
} = toRefs(state)

const handleSet = (formComponentList: Component[]) => {
  componentList.value = formComponentList
}

const handleReset = () => {
  componentList.value = []
}

defineExpose({
  handleSet,
  handleReset
})
</script>

<style lang="scss" scoped>
</style>
