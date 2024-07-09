<template>
  <FormDesigner v-model="designerData" />
  <el-card header="表单渲染器" class="mt-15 mb-15">
    <FormRender v-model="renderData" :components="designerData" />
  </el-card>
  <el-button @click="handleDesignerData">获取表单设计器数据</el-button>
  <el-button @click="handleRenderData">获取表单渲染器数据</el-button>
</template>

<script lang="ts" setup>
import { Component } from '@/components/FormDesigner/types'

const state = reactive({
  designerData: [] as Component[],
  renderData: {} as { [key: string]: any }
})

const {
  designerData,
  renderData
} = toRefs(state)

const handleDesignerData = () => {
  console.log(designerData.value)
}

const handleRenderData = () => {
  console.log(renderData.value)
}
</script>

<style lang="scss" scoped>
</style>
