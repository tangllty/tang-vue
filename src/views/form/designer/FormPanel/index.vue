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
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { useDraggable } from 'vue-draggable-plus'
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../types'
import { SortableEvent } from 'sortablejs'

const proxy = getProxy()

const state = reactive({
  activeItem: {} as Component,
  fromComponentList: [] as Component[]
})

const {
  activeItem,
  fromComponentList
} = toRefs(state)

const fromRef = ref<HTMLDivElement>()

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
  }
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

onMounted(async () => {
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
}
</style>
