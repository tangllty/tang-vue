<template>
  <el-form-item
    v-if="component.label && component.labelVisible"
    :label="component.label"
    :labelWidth="component.labelWidth"
  >
    <template #label>
      <span class="text-truncate">{{ component.label }}</span>
    </template>
    <RenderFormComponent v-model="component" />
  </el-form-item>
  <RenderFormComponent v-else v-model="component" />
</template>

<script lang="ts" setup>
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../types'
import RenderFormComponent from './RenderFormComponent.vue'

const proxy = getProxy()

const props = defineProps({
  modelValue: {
    type: Object as () => Component,
    default: null
  }
})

const component = computed({
  get: () => props.modelValue,
  set: val => proxy.$emit('update:modelValue', val)
})
</script>

<style lang="scss" scoped>
</style>
