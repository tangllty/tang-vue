<template>
  <el-form
    label-width="60px"
    class="pr-8 pl-8"
  >
    <el-form-item label="元素">
      <el-input v-model="element.element" placeholder="请输入元素" />
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="element.label" placeholder="请输入标题" />
    </el-form-item>
    <el-form-item label="字段">
      <el-input v-model="element.field" placeholder="请输入字段" />
    </el-form-item>
    <el-form-item label="默认值">
      <el-input v-model="element.defaultValue" placeholder="请输入默认值" />
    </el-form-item>
    <el-form-item label="占位符">
      <el-input v-model="element.placeholder" placeholder="请输入占位符" />
    </el-form-item>
    <el-form-item v-if="['el-input'].includes(element.element)" label="前缀">
      <el-input v-model="element.prepend" placeholder="请输入前缀" />
    </el-form-item>
    <el-form-item v-if="['el-input'].includes(element.element)" label="后缀">
      <el-input v-model="element.append" placeholder="请输入后缀" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue'
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../types'

const proxy = getProxy()

const props = defineProps({
  activeItem: {
    type: Object as PropType<Component>,
    default: () => ({})
  }
})

const element = computed({
  get: () => props.activeItem,
  set: (val) => proxy.$emit('update:activeItem', val)
})
</script>

<style lang="scss" scoped>
</style>
