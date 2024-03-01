<template>
  <div ref="nestedFromRef">
    <div
      v-for="(component, index) in components"
      :key="component.element"
    >
      <RenderForm v-model="components[index]" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDraggable } from 'vue-draggable-plus'
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../types'
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

const nestedFromRef = ref<HTMLDivElement>()

useDraggable(nestedFromRef, components, {
  animation: 350,
  ghostClass: 'dragging',
  group: 'components'
})
</script>

<style lang="scss" scoped>
</style>
