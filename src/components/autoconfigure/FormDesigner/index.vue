<template>
  <FormDesigner v-model="formComponentList" />
</template>

<script lang="ts" setup>
import { getProxy } from '@/utils/getCurrentInstance'
import FormDesigner from '@/components/FormDesigner/index.vue'
import { Component } from '@/components/FormDesigner/types'

const proxy = getProxy()

const props = defineProps({
  modelValue: {
    type: Array as PropType<Component[]>,
    default: () => []
  }
})

const formComponentList = computed({
  get: () => props.modelValue,
  set: val => proxy.$emit('update:modelValue', val)
})
</script>

<style lang="scss" scoped>
</style>
