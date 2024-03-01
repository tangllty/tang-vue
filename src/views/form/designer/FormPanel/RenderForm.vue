<template>
  <el-form-item :label="component.label">
    <template #label>
      <span class="text-truncate">{{ component.label }}</span>
    </template>
    <el-input
      v-if="component.element === 'el-input'"
      v-model="component.vModel"
      :placeholder="component.placeholder"
    >
      <template v-if="component.prepend" #prepend>{{ component.prepend }}</template>
      <template v-if="component.append" #append>{{ component.append }}</template>
      <template v-if="component.prefix" #prefix>
        <el-icon>
          <SvgIcon :name="component.prefix" />
        </el-icon>
      </template>
      <template v-if="component.suffix" #suffix>
        <el-icon>
          <SvgIcon :name="component.suffix" />
        </el-icon>
      </template>
    </el-input>
    <el-input
      v-else-if="component.element === 'el-input-textarea'"
      type="textarea"
      v-model="component.vModel"
      :placeholder="component.placeholder"
    />
    <el-input-number
      v-else-if="component.element === 'el-input-number'"
      v-model="component.vModel"
      :placeholder="component.placeholder"
    />
  </el-form-item>
</template>

<script lang="ts" setup>
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../types'

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
