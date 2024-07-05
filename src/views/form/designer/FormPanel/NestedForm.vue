<template>
  <div ref="nestedFromRef" class="nested-container">
    <div
      v-for="(component, index) in components"
      :key="component.id"
      class="components-container"
      :class="{ 'active-item': activeItem === component }"
      @click="handleActiveItem(component, $event)"
      @click.right.native="showContextMenu($event, component)"
    >
      <el-icon v-if="activeItem === component" class="drag-handler">
        <Rank />
      </el-icon>
      <RenderForm v-model="components[index]" v-model:activeItem="activeItem" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDraggable } from 'vue-draggable-plus'
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../types'
import type { ContextMenuOptions, MenuItem } from '@/components/ContextMenu/types'
import RenderForm from './RenderForm.vue'

const proxy = getProxy()

const props = defineProps({
  modelValue: {
    type: Array<Component>,
    default: []
  },
  activeItem: {
    type: Object as PropType<Component>,
    default: null
  }
})

const components = computed({
  get: () => props.modelValue,
  set: val => proxy.$emit('update:modelValue', val)
})

const activeItem = computed<Component>({
  get: () => props.activeItem,
  set: val => proxy.$emit('update:activeItem', val)
})

const handleActiveItem = (component: Component, event: MouseEvent | null = null) => {
  if (!event) return
  event.preventDefault()
  event.stopPropagation()
  activeItem.value = component
}

const showContextMenu = (e: MouseEvent, component: Component) => {
  const items: MenuItem[] = [
    {
      label: '删除',
      icon: '删除',
      onClick: () => {
        components.value = components.value.filter(item => item !== component)
      }
    },
    {
      label: '复制',
      icon: '复制',
      onClick: () => {
        components.value.push({ ...component })
      }
    }
  ]
  const options: ContextMenuOptions = {
    items
  }
  proxy.$contextMenu(e, options)
}

const nestedFromRef = ref<HTMLDivElement>()

useDraggable(nestedFromRef, components, {
  animation: 350,
  ghostClass: 'dragging',
  group: 'components',
  handle: '.drag-handler'
})
</script>

<style lang="scss" scoped>
@import './index.scss';

.nested-container {
  height: 100%;

  .components-container {
    margin: 4px 0;
    position: relative;

    .drag-handler {
      cursor: move;
      position: absolute;
      z-index: 1;
    }

    .el-form-item {
      padding: 4px 0;
      margin: 8px 0;
    }

    &:first-child > .component > .el-form-item {
      margin-top: 0;
    }

    &:last-child > .component > .el-form-item {
      margin-bottom: 0;
    }

    .container {
      min-height: 55px;
    }
  }
}
</style>
