<template>
  <el-form label-width="120px">
    <div
      ref="formRef"
      class="components-container"
      :style="{ minHeight: $el ? $el.clientHeight + 'px' : '100%' }"
    >
      <div
        v-for="(item, index) in formComponentList"
        :key="item.id"
        class="component-container"
        :class="{ 'active-item': activeItem === item }"
        @click="handleActiveItem(item, $event)"
        @click.right.native="showContextMenu($event, item)"
      >
        <el-icon v-if="activeItem === item" class="drag-handler">
          <Rank />
        </el-icon>
        <RenderForm
          v-model="formComponentList[index]"
          v-model:activeItem="activeItem"
          class="component"
        />
      </div>
      <div
        v-if="!formComponentList.length"
        ref="emptyInfoRef"
        class="empty-info"
        :style="emptyInfoStyle"
      >
        <el-empty description="请从左侧点击组件或拖拽组件到此处" />
      </div>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { useDraggable } from 'vue-draggable-plus'
import { Rank } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../types'
import { SortableEvent } from 'sortablejs'
import type { ContextMenuOptions, MenuItem } from '@/components/ContextMenu/types'
import RenderForm from './RenderForm.vue'

const proxy = getProxy()

const props = defineProps({
  activeItem: {
    type: Object as PropType<Component>,
    default: null
  }
})

const state = reactive({
  formComponentList: [] as Component[],
  emptyInfoStyle: {}
})

const {
  formComponentList,
  emptyInfoStyle
} = toRefs(state)

const formRef = ref<HTMLDivElement>()
const emptyInfoRef = ref<HTMLDivElement>()

useDraggable(formRef, formComponentList, {
  animation: 350,
  ghostClass: 'dragging',
  group: 'components',
  // 有新元素添加到列表时选中新元素
  onAdd: (event: SortableEvent) => {
    const newIndex = event.newIndex
    if (newIndex === undefined) return
    const component = formComponentList.value[newIndex]
    handleActiveItem(component)
  },
  filter: '.empty-info',
  handle: '.drag-handler'
})

const activeItem = computed<Component>({
  get: () => props.activeItem,
  set: val => proxy.$emit('update:activeItem', val)
})

const handleActiveItem = (item: Component, event: MouseEvent | null = null) => {
  if (event) event.preventDefault()
  activeItem.value = item
}

const handleReset = () => {
  formComponentList.value = []
  activeItem.value = {} as Component
}

const showContextMenu = (e: MouseEvent, component: Component) => {
  const items: MenuItem[] = [
    {
      label: '删除',
      icon: '删除',
      onClick: () => {
        formComponentList.value = formComponentList.value.filter((item) => item !== component)
      }
    },
    {
      label: '复制',
      icon: '复制',
      onClick: () => {
        formComponentList.value.push({ ...component })
      }
    }
  ]
  const options: ContextMenuOptions = {
    items
  }
  proxy.$contextMenu(e, options)
}

const computeEmptyInfoStyle = async () => {
  await proxy.$nextTick()
  if (!formRef.value || !emptyInfoRef.value) return
  emptyInfoStyle.value = {
    top: -(formRef.value.clientHeight / 2 - emptyInfoRef.value.clientHeight / 2) + 'px',
    left: formRef.value.clientWidth / 2 - emptyInfoRef.value.clientWidth / 2 + 'px'
  }
}

onMounted(async () => {
  await computeEmptyInfoStyle()
})

defineExpose({
  formComponentList,
  handleActiveItem,
  handleReset
})
</script>

<style lang="scss" scoped>
@import './index.scss';

.components-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 0.25rem;

  .component-container {
    height: 100%;
    position: relative;
    margin: 4px 0;

    .el-form-item {
      margin: 8px 0;
    }

    &:first-child > .component > .el-form-item {
      margin-top: 0;
    }

    &:last-child > .component > .el-form-item {
      margin-bottom: 0;
    }
  }

  .empty-info {
    position: absolute;
  }
}
</style>
