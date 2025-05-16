<template>
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
  <el-select
    v-else-if="component.element === 'el-select'"
    v-model="component.vModel"
    :placeholder="component.placeholder"
  >
    <el-option
      v-for="(item, index) in component.options"
      :key="index"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  <el-cascader
    v-else-if="component.element === 'el-cascader'"
    v-model="component.vModel"
    :options="component.cascaderOptions"
    :placeholder="component.placeholder"
    style="width: 100%"
  />
  <el-radio-group
    v-else-if="component.element === 'el-radio'"
    v-model="component.vModel"
  >
    <el-radio
      v-for="(item, index) in component.options"
      :key="index"
      :value="item.value"
    >{{ item.label }}</el-radio>
  </el-radio-group>
  <el-checkbox-group
    v-else-if="component.element === 'el-checkbox'"
    v-model="component.vModel"
  >
    <el-checkbox
      v-for="(item, index) in component.options"
      :key="index"
      :value="item.value"
      :label="item.label"
    />
  </el-checkbox-group>
  <div
    v-else-if="component.code"
    v-html="component.code"
  />
  <pre
    v-else-if="component.text"
    class="mt-0 mb-0"
    :style="{
      whiteSpace: 'pre-wrap',
      textAlign: component.align,
      fontSize: component.fontSize + 'px',
      lineHeight: component.fontSize * component.lineHeight + 'px'
    }"
  >{{ component.text }}</pre>
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
