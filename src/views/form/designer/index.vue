<template>
  <el-container class="form-container">
    <el-aside class="left-container">
      <ComponentPanel @componentClick="handleComponentClick" />
    </el-aside>
    <el-container class="main-container">
      <el-header class="header">
        <el-button
          type="danger"
          :icon="Delete"
          text
          @click="handleReset"
        >清空</el-button>
      </el-header>
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
    </el-container>
    <el-aside class="right-container">
      <el-header class="header">
        Right Header
      </el-header>
      <RightPanel v-model:activeItem="activeItem" class="right-panel" />
    </el-aside>
  </el-container>
</template>

<script lang="ts" setup>
import { ElScrollbar } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
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
  if (!fromPanelRef.value) return
  fromPanelRef.value.fromComponentList.push(component)
  fromPanelRef.value.handleActiveItem(component)
  if (!scrollerRef.value) return
  console.log('scrollerRef.value')
  // TODO 如果添加的元素超出了可视区域，滚动到该元素的位置
}

const handleReset = async () => {
  try {
    await proxy.$confirm('确定清空表单吗？', '提示', {
      type: 'warning'
    })
    if (!fromPanelRef.value) return
    fromPanelRef.value.handleReset()
  } catch (error) { /* empty */ }
}

onMounted(async () => {
})
</script>

<style lang="scss" scoped>
.header {
  height: 50px;
  border-bottom: 1px solid #f1e8e8;
  display: flex;
  align-items: center;
}

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
  }

  .right-container {
    width: 260px;

    .right-panel {
      height: calc(100% - 50px);
    }
  }
}
</style>
