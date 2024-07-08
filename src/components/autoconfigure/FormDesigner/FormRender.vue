<template>
  <el-form label-width="120px">
    <Render v-model="components" />
  </el-form>
</template>

<script lang="ts" setup>
import { getProxy } from '@/utils/getCurrentInstance'
import Render from '@/components/FormDesigner/Toolbar/RenderForm/Render.vue'
import type { Component } from '@/components/FormDesigner/types'

const proxy = getProxy()

const props = defineProps({
  modelValue: {
    type: Object as PropType<{ [key: string]: any }>,
    default: () => ({})
  },
  components: {
    type: Array as PropType<Component[]>,
    default: () => []
  }
})

const handleVModelData = (formComponentList: Component[]): { [key: string]: any } => {
  return formComponentList.reduce((formData, item) => {
    if (item.field) {
      (formData as { [key: string]: any })[item.field] = item.vModel
    }

    if (item.children) {
      Object.assign(formData, handleVModelData(item.children))
    }

    return formData
  }, {})
}

const components = computed(() => props.components)

watch(props.components, (newVal) => proxy.$emit('update:modelValue', handleVModelData(newVal)), { immediate: true })
</script>

<style lang="scss" scoped>
</style>
