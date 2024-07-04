<template>
  <RenderFormItem v-if="component.type === 'component'" v-model="component" />

  <template v-else-if="component.type === 'container' && component.children">
    <el-row v-if="component.element === 'el-row'">
      <el-col
        v-for="(item, index) in component.children"
        :key="index"
        :span="item.span"
        :class="{ 'active-item': activeItem === item }"
        @click="handleActiveItem(item, $event)"
      >
        <el-icon v-if="activeItem === item" class="drag-handler">
          <Rank />
        </el-icon>
        <NestedForm v-model="item.children" v-model:activeItem="activeItem" />
      </el-col>
    </el-row>
    <el-card v-else-if="component.element === 'el-card'" :header="component.header">
      <NestedForm v-model="component.children" v-model:activeItem="activeItem" />
    </el-card>
  </template>
</template>

<script lang="ts" setup>
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../types'
import RenderFormItem from './RenderFormItem.vue'
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
@import './index.scss';

.el-row, .el-col {
  border: 1px dashed #336699;
}

.el-row {
  padding: 2px;
}

.el-col {
  padding: 0 8px;
  position: relative;

  .drag-handler {
    left: -2px;
  }
}

:deep(.el-card__body) {
  min-height: 20px;
}
</style>
