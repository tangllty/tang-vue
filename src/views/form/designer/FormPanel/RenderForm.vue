<template>
  <el-form-item
    v-if="component.type === 'component'"
    :label="component.label"
    :labelWidth="component.labelWidth"
  >
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

  <template v-else-if="component.type === 'container' && component.children">
    <el-row v-if="component.element === 'el-row'">
      <el-col
        v-for="(item, index) in component.children"
        :key="index"
        :span="item.span"
        :class="{ 'active-item': activeItem === item }"
        @click="handleActiveItem(item, $event)"
      >
        <NestedForm v-model="item.children" v-model:activeItem="activeItem" />
      </el-col>
    </el-row>
  </template>
</template>

<script lang="ts" setup>
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../types'
import NestedForm from './NestedForm.vue'

const proxy = getProxy()

const props = defineProps({
  modelValue: {
    type: Object as () => Component,
    default: null
  },
  activeItem: {
    type: Object as PropType<Component>,
    default: null
  }
})

const component = computed({
  get: () => props.modelValue,
  set: val => proxy.$emit('update:modelValue', val)
})

const activeItem = computed<Component>({
  get: () => props.activeItem,
  set: val => proxy.$emit('update:activeItem', val)
})

const handleActiveItem = (item: Component, event: MouseEvent | null = null) => {
  if (!event) return
  event.preventDefault()
  event.stopPropagation()
  activeItem.value = item
}
</script>

<style lang="scss" scoped>
.active-item {
  outline: 2px solid var(--el-color-primary);
}

.el-row {
  min-height: 50px;
  border: 1px dashed #336699;
}

.el-col {
  min-height: 50px;
  padding: 2px;
  border: 1px dashed #336699;
}
</style>
