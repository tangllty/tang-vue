<template>
  <el-container class="form-container">
    <el-aside class="left-container">
      <el-header class="header">
        组件库
      </el-header>
      <ComponentPanel
        ref="componentPanelRef"
        @componentClick="handleComponentClick"
        class="left-panel"
      />
    </el-aside>
    <el-container class="main-container">
      <el-header class="header flex flex-justify-end">
        <el-button
          type="danger"
          :icon="Delete"
          text
          @click="handleReset"
        >清空</el-button>
        <el-button
          type="primary"
          :icon="View"
          text
          @click="handlePreviewJson"
        >预览 JSON</el-button>
        <el-button
          type="primary"
          :icon="View"
          text
          @click="handlePreview"
        >预览</el-button>
        <el-button
          type="success"
          :icon="View"
          text
          @click="handleSave"
        >保存</el-button>
        <el-button
          type="warning"
          :icon="Delete"
          text
          @click="handleCancel"
        >关闭</el-button>
      </el-header>
      <el-scrollbar ref="scrollerRef" :view-style="{
        minHeight: 'calc(100% - 40px)',
        padding: '20px'
      }">
        <FormPanel
          ref="formPanelRef"
          v-model="formComponentList"
          v-model:activeItem="activeItem"
          @getId="getId"
          :style="{
            minHeight: scrollerRef ? scrollerRef.$el.clientHeight - 40 + 'px' : '100%'
          }"
        />
      </el-scrollbar>
    </el-container>
    <el-aside class="right-container">
      <el-header class="header">
        组件设置
      </el-header>
      <RightPanel
        v-model:activeItem="activeItem"
        @getId="getId"
        class="right-panel"
      />
    </el-aside>

    <PreviewJson ref="previewJsonRef" />
    <Preview ref="previewRef" />
  </el-container>
</template>

<script lang="ts" setup>
import type { ScrollbarInstance } from 'element-plus'
import { Delete, View } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from './types'
import type { ComponentPanelInstance, FormPanelInstance, PreviewJsonInstance, PreviewInstance } from './instance'
import ComponentPanel from './ComponentPanel/index.vue'
import FormPanel from './FormPanel/index.vue'
import RightPanel from './RightPanel/index.vue'
import PreviewJson from './Toolbar/PreviewJson.vue'
import Preview from './Toolbar/Preview.vue'

const proxy = getProxy()

const props = defineProps({
  modelValue: {
    type: Array as PropType<Component[]>,
    default: () => []
  },
  save: {
    type: Function as PropType<() => void>,
    default: () => {}
  },
  cancel: {
    type: Function as PropType<() => void>,
    default: () => {}
  }
})

const state = reactive({
  activeItem: {} as Component
})

const {
  activeItem
} = toRefs(state)

const componentPanelRef = ref<ComponentPanelInstance>()
const scrollerRef = ref<ScrollbarInstance>()
const formPanelRef = ref<FormPanelInstance>()
const previewJsonRef = ref<PreviewJsonInstance>()
const previewRef = ref<PreviewInstance>()

const formComponentList = computed({
  get: () => props.modelValue,
  set: val => proxy.$emit('update:modelValue', val)
})

const getId = (callback: (id: number) => void) => {
  if (!componentPanelRef.value) return
  componentPanelRef.value.id++
  callback(componentPanelRef.value.id)
}

const handleComponentClick = async (component: Component) => {
  if (!formPanelRef.value) return
  formPanelRef.value.formComponentList.push(component)
  formPanelRef.value.handleActiveItem(component)
  if (!scrollerRef.value) return
  console.log('scrollerRef.value')
  // TODO 如果添加的元素超出了可视区域，滚动到该元素的位置
}

const handleReset = async () => {
  try {
    await proxy.$confirm('确定清空表单吗？', '提示', {
      type: 'warning'
    })
    if (!formPanelRef.value) return
    formPanelRef.value.handleReset()
  } catch (error) { /* empty */ }
}

const handlePreviewJson = async () => {
  if (!previewJsonRef.value || !formPanelRef.value) return
  previewJsonRef.value.handleShow(formPanelRef.value.formComponentList)
}

const handlePreview = async () => {
  if (!previewRef.value || !formPanelRef.value) return
  previewRef.value.handleShow(formPanelRef.value.formComponentList)
}

const handleSave = async () => {
  if (!props.save) return
  await props.save()
}

const handleCancel = async () => {
  if (!props.cancel) return
  await props.cancel()
}

const initId = async () => {
  if (!componentPanelRef.value) return
  if (componentPanelRef.value.id != 1) return

  const getMaxId = (components: Component[], maxId: number = 0) => {
    components.forEach((component) => {
      const componentId = Number(component.id.slice(3))
      if (componentId > maxId) {
        maxId = componentId
      }
      if (component.children) {
        maxId = getMaxId(component.children, maxId)
      }
    })
    return maxId
  }
  const maxId = getMaxId(props.modelValue)
  componentPanelRef.value.id = maxId
}

watch(() => props.modelValue, () => {
  initId()
})

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

    .left-panel {
      --left-panel-padding: 18px;
      height: calc(100% - 50px - 2 * var(--left-panel-padding));
      margin-top: var(--left-panel-padding);
      margin-bottom: var(--left-panel-padding);
    }
  }

  .main-container {
    border-left: 1px solid #f1e8e8;
    border-right: 1px solid #f1e8e8;

    .header {
      .el-button {
        padding: 8px 12px;
        border-radius: 6px;

        + .el-button {
          margin-left: 4px;
        }
      }
    }
  }

  .right-container {
    width: 260px;

    .right-panel {
      --right-panel-padding: 18px;
      height: calc(100% - 50px - 2 * var(--right-panel-padding));
      margin-top: var(--right-panel-padding);
      margin-bottom: var(--right-panel-padding);
    }
  }
}
</style>
