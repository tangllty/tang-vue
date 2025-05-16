<template>
  <el-form label-width="100px">
    <Render v-model="componentList" />
  </el-form>

  <footer class="flex flex-justify-end pt-16">
    <el-button type="primary" @click="handleFormData">获取数据</el-button>
    <el-button type="primary" @click="handleFormReset">重置</el-button>
    <el-button @click="handleClose">关闭</el-button>
  </footer>

  <el-dialog
    :title="formDataDialog.title"
    v-model="formDataDialog.visible"
    width="65%"
    append-to-body
  >
    <el-button
      type="primary"
      link
      :icon="DocumentCopy"
      size="small"
      class="fr"
      @click="$copy(formData)"
    >复制</el-button>
    <Highlight :code="formData" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { DocumentCopy } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../../types'
import Render from './Render.vue'

const proxy = getProxy()

const state = reactive({
  componentList: [] as Component[],
  formData: '',
  formDataDialog: {
    title: '表单数据预览',
    type: 'list',
    visible: false
  } as Dialog
})

const {
  formData,
  formDataDialog,
  componentList
} = toRefs(state)

const handleSet = (formComponentList: Component[]) => {
  componentList.value = handleResetVModel(formComponentList)
}

const handleResetVModel = (formComponentList: Component[]): Component[] => {
  return formComponentList.map(item => {
    if (item.children) {
      item.children = handleResetVModel(item.children)
    }
    if (item.vModel instanceof Array) {
      return {
        ...item,
        vModel: []
      }
    }
    return {
      ...item,
      vModel: null
    }
  })
}

const handleReset = () => {
  componentList.value = []
}

const handleFormReset = () => {
  componentList.value = handleResetVModel(componentList.value)
}

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

const handleFormData = () => {
  const formData = handleVModelData(componentList.value)
  state.formData = JSON.stringify(formData, null, 2)
  formDataDialog.value.visible = true
  console.log(proxy)
}

const handleClose = () => {
  proxy.$emit('close')
}

defineExpose({
  handleSet,
  handleReset
})
</script>

<style lang="scss" scoped>
</style>
