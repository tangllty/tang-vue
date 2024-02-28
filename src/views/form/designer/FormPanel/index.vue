<template>
  <el-form label-width="120px">
    <div
      ref="fromRef"
      class="components-container"
      :style="{ minHeight: $el ? $el.clientHeight + 'px' : '100%' }"
    >
      <div
        v-for="item in fromComponentList"
        :key="item.element"
        class="component-container cursor-move"
        :class="{ 'active-item': activeItem === item }"
        @click="handleActiveItem(item, $event)"
      >
        <el-form-item
          :label="item.label"
          class="component"
        >
          <template #label>
            <span class="text-truncate">{{ item.label }}</span>
          </template>
          <el-input
            v-if="item.element === 'el-input'"
            v-model="item.vModel"
            :placeholder="item.placeholder"
          >
            <template v-if="item.prepend" #prepend>{{ item.prepend }}</template>
            <template v-if="item.append" #append>{{ item.append }}</template>
            <template v-if="item.prefix" #prefix>
              <el-icon>
                <SvgIcon :name="item.prefix" />
              </el-icon>
            </template>
            <template v-if="item.suffix" #suffix>
              <el-icon>
                <SvgIcon :name="item.suffix" />
              </el-icon>
            </template>
          </el-input>
          <el-input
            v-else-if="item.element === 'el-input-textarea'"
            type="textarea"
            v-model="item.vModel"
            :placeholder="item.placeholder"
          />
          <el-input-number
            v-else-if="item.element === 'el-input-number'"
            v-model="item.vModel"
            :placeholder="item.placeholder"
          />
        </el-form-item>
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
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../types'
import { SortableEvent } from 'sortablejs'

const proxy = getProxy()

const state = reactive({
  activeItem: {} as Component,
  fromComponentList: [] as Component[],
  emptyInfoStyle: {}
})

const {
  activeItem,
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
  filter: '.empty-info'
})

const handleComponentClick = (component: Component) => {
  fromComponentList.value.push(component)
  activeItem.value = component
}

const handleActiveItem = (item: Component, event: MouseEvent | null = null) => {
  if (event) event.preventDefault()
  activeItem.value = item
  proxy.$emit('update:activeItem', item)
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

    .component {
      cursor: move;
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
