<template>
  <el-form label-width="120px">
    <div
      ref="fromRef"
      class="components-container"
      :style="{ minHeight: $el ? $el.clientHeight + 'px' : '100%' }"
    >
      <div
        v-for="(item, index) in fromComponentList"
        :key="item.element"
        class="component-container"
        :class="{ 'active-item': activeItem === item }"
        @click="handleActiveItem(item, $event)"
        @click.right.native="showContextMenu($event, item)"
      >
        <el-icon v-if="activeItem === item" class="drag-handler">
          <Rank />
        </el-icon>
        <NestedForm
          v-if="item.element === 'el-row'"
          v-model="fromComponentList[index].children"
          class="container"
        />
        <RenderForm
          v-else
          v-model="fromComponentList[index]"
          class="component"
        />
      </div>
      <div
        v-if="!fromComponentList.length"
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
import NestedForm from './NestedForm.vue'

const proxy = getProxy()

const props = defineProps({
  activeItem: {
    type: Object as PropType<Component>,
    default: null
  }
})

const state = reactive({
  fromComponentList: [] as Component[],
  emptyInfoStyle: {}
})

const {
  fromComponentList,
  emptyInfoStyle
} = toRefs(state)

const fromRef = ref<HTMLDivElement>()
const emptyInfoRef = ref<HTMLDivElement>()

useDraggable(fromRef, fromComponentList, {
  animation: 350,
  ghostClass: 'dragging',
  group: 'components',
  // 有新元素添加到列表时选中新元素
  onAdd: (event: SortableEvent) => {
    const newIndex = event.newIndex
    if (newIndex === undefined) return
    const component = fromComponentList.value[newIndex]
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

const showContextMenu = (e: MouseEvent, component: Component) => {
  const items: MenuItem[] = [
    {
      label: '删除',
      icon: '删除',
      onClick: () => {
        fromComponentList.value = fromComponentList.value.filter((item) => item !== component)
      }
    },
    {
      label: '复制',
      icon: '复制',
      onClick: () => {
        fromComponentList.value.push({ ...component })
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
  if (!fromRef.value || !emptyInfoRef.value) return
  emptyInfoStyle.value = {
    top: -(fromRef.value.clientHeight / 2 - emptyInfoRef.value.clientHeight / 2) + 'px',
    left: fromRef.value.clientWidth / 2 - emptyInfoRef.value.clientWidth / 2 + 'px'
  }
}

onMounted(async () => {
  await computeEmptyInfoStyle()
})

defineExpose({
  fromComponentList,
  handleActiveItem
})
</script>

<style lang="scss" scoped>
.active-item {
  outline: 2px solid var(--el-color-primary);
}

.dragging {
  outline: 2px solid var(--el-color-primary);
  // font-size: 0;
  // opacity: 0.5;
}

.components-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 0.25rem;

  .component-container {
    height: 100%;
    position: relative;
    margin: 4px 0;

    .drag-handler {
      cursor: move;
      position: absolute;
      z-index: 1;
    }

    .container {
      min-height: 55px;
      border: 1px dashed #336699;
    }

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
