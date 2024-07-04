<template>
  <template v-for="(component, index) in componentList" :key="index">
    <RenderFormItem v-if="component.type === 'component'" v-model="componentList[index]" />
    <template v-else-if="component.type === 'container' && component.children">
      <el-row v-if="component.element === 'el-row'">
        <el-col
          v-for="(childComponent, j) in component.children"
          :key="j"
          :span="childComponent.span"
        >
          <Render v-model="childComponent.children" />
        </el-col>
      </el-row>
      <el-card v-else-if="component.element === 'el-card'" :header="component.header">
        <Render v-model="component.children" />
      </el-card>
      <el-watermark v-else-if="component.element === 'el-watermark'" :content="component.watermark">
        <Render v-model="component.children" />
      </el-watermark>
    </template>
  </template>
</template>

<script lang="ts" setup>
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../../types'
import RenderFormItem from '../../FormPanel/RenderFormItem.vue'

const proxy = getProxy()

const props = defineProps({
  modelValue: {
    type: Array<Component>,
    default: []
  }
})

const componentList = computed({
  get: () => props.modelValue,
  set: (value: Component[]) => proxy.$emit('update:modelValue', value)
})
</script>

<style lang="scss" scoped>
</style>
