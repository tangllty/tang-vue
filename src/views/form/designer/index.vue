<template>
  <el-container class="form-container">
    <el-aside class="left-container">
      <ComponentPanel @componentClick="handleComponentClick" />
    </el-aside>
    <el-main class="main-container">
      <el-scrollbar ref="scrollerRef" :view-style="{
        minHeight: 'calc(100% - 40px)',
        padding: '20px'
      }">
        <FromPanel
          ref="fromPanelRef"
          v-model:activeItem="activeItem"
          :style="{
            minHeight: scrollerRef ? scrollerRef.$el.clientHeight - 40 + 'px' : '100%'
          }"
        />
      </el-scrollbar>
    </el-main>
    <el-aside class="right-container">
      <RightPanel v-model:activeItem="activeItem" />
    </el-aside>
  </el-container>
</template>

<script lang="ts" setup>
import { ElScrollbar } from 'element-plus'
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from './types'
import ComponentPanel from './ComponentPanel/index.vue'
import FromPanel from './FormPanel/index.vue'
import RightPanel from './RightPanel/index.vue'

const proxy = getProxy()

const state = reactive({
  activeItem: {} as Component
})

const {
  activeItem
} = toRefs(state)

const scrollerRef = ref<InstanceType<typeof ElScrollbar>>()
const fromPanelRef = ref<InstanceType<typeof FromPanel>>()

const handleComponentClick = async (component: Component) => {
  fromPanelRef.value?.fromComponentList.push(component)
  fromPanelRef.value?.handleActiveItem(component)
  if (!scrollerRef.value) return
  console.log('scrollerRef.value')
  // TODO 如果添加的元素超出了可视区域，滚动到该元素的位置
}

onMounted(async () => {
})
</script>

<style lang="scss" scoped>
.form-container {
  height: 100%;
  border: 1px solid #f1e8e8;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);

  .left-container {
    $leftWidth: 250px;

    width: $leftWidth;
    overflow-x: hidden;
  }

  .main-container {
    border-left: 1px solid #f1e8e8;
    border-right: 1px solid #f1e8e8;
    height: 100%;
    padding: 0;
  }

  .right-container {
    width: 260px;
  }
}
</style>
