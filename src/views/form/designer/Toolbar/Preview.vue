<template>
  <el-dialog
    :title="previewDialog.title"
    v-model="previewDialog.visible"
    width="65%"
    @close="closePreviewDialog"
  >
    <RenderForm ref="renderFormRef" />
  </el-dialog>
</template>

<script lang="ts" setup>
import type { Component } from '../types'
import { deepClone } from '@/utils/object'
import { getProxy } from '@/utils/getCurrentInstance'
import type { RenderFormInstance } from './instance'
import RenderForm from './RenderForm/index.vue'

const proxy = getProxy()

const state = reactive({
  previewDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog
})

const {
  previewDialog
} = toRefs(state)

const renderFormRef = ref<RenderFormInstance>()

const handleShow = async (formComponentList: Component[]) => {
  previewDialog.value = {
    title: '预览',
    type: 'list',
    visible: true
  }

  await proxy.$nextTick()
  if (!renderFormRef.value) return
  renderFormRef.value.handleSet(deepClone(formComponentList))
}

const closePreviewDialog = () => {
  previewDialog.value.visible = false
  if (!renderFormRef.value) return
  renderFormRef.value.handleReset()
}

defineExpose({
  handleShow
})
</script>

<style lang="scss" scoped>
</style>
