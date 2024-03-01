<template>
  <div ref="nestedFromRef">
    <div
      v-for="(component, index) in components"
      :key="component.element"
      :class="{ 'active-item': activeItem === component }"
      @click="handleActiveItem(component, $event)"
    >
      <el-icon v-if="activeItem === component" class="drag-handler">
        <Rank />
      </el-icon>
      <RenderForm :component="component" v-model="components[index]" />
      <nested-function v-model="component.children" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDraggable } from 'vue-draggable-plus'
import { Rank } from '@element-plus/icons-vue'
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

const handleActiveItem = (component: Component, event: MouseEvent | null = null) => {
  if (event) event.preventDefault()
  activeItem.value = component
  proxy.$emit('update:activeItem', component)
}

useDraggable(nestedFromRef, components, {
  animation: 350,
  ghostClass: 'dragging',
  group: 'components'
})
</script>

<style lang="scss" src="./index.scss" scoped>
</style>
