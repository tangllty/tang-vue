<template>
  <RenderFormItem v-if="component.type === 'component'" v-model="component" />

  <template v-else-if="component.type === 'container' && component.children">
    <RenderContainer
      v-model="component"
      v-model:activeItem="activeItem"
      @showContextMenu="showContextMenu"
      @click.right.native="showContextMenu($event, component)"
    />
  </template>
</template>

<script lang="ts" setup>
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../types'
import RenderContainer from './RenderContainer.vue'
import RenderFormItem from './RenderFormItem.vue'

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

const showContextMenu = (event: MouseEvent, component: Component) => {
  event.stopPropagation()
  proxy.$emit('showContextMenu', event, component)
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
