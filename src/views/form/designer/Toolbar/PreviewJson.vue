<template>
  <el-dialog
    :title="previewJsonDialog.title"
    v-model="previewJsonDialog.visible"
    width="65%"
    @close="closePreviewJsonDialog"
    append-to-body
  >
      <el-button
        type="primary"
        link
        :icon="DocumentCopy"
        size="small"
        class="fr"
        @click="handleCopy(previewCode)"
      >复制</el-button>
    <highlightjs :code="previewCode" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { DocumentCopy } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../types'

const proxy = getProxy()

const state = reactive({
  previewCode: '',
  previewJsonDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog
})

const {
  previewCode,
  previewJsonDialog
} = toRefs(state)

const handleShow = async (formComponentList: Component[]) => {
  previewCode.value = JSON.stringify(formComponentList, null, 2)

  previewJsonDialog.value = {
    title: '预览 JSON',
    type: 'list',
    visible: true
  }
}

const handleCopy = async (code: string) => {
  await navigator.clipboard.writeText(code)
  proxy.$message.success('复制成功')
}

const closePreviewJsonDialog = () => {
  previewJsonDialog.value.visible = false
  previewCode.value = ''
}

defineExpose({
  handleShow
})
</script>

<style lang="scss" scoped>
</style>
