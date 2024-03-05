<template>
  <div ref="componentRef" class="component-container">
    <div
      v-for="item in componentList"
      :key="item.element"
      class="component"
      @click="handleComponentClick(item)"
    >
      <span>
        <el-icon class="icon">
          <SvgIcon :name="item.icon" />
        </el-icon>
        {{ item.name }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDraggable } from 'vue-draggable-plus'
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../types'

const proxy = getProxy()

const props = defineProps({
  componentList: {
    type: Array<Component>,
    default: []
  },
  id: {
    type: Number,
    default: 0
  },
  fieldId: {
    type: Number,
    default: 0
  }
})

const state = reactive({
  componentDataList: props.componentList
})

const {
  componentDataList
} = toRefs(state)

const componentRef = ref<HTMLDivElement>()

const cloneComponent = (component: Component) => {
  proxy.$emit('update:id', props.id + 1)
  let clonedComponent = {
    ...component,
    id: `key${props.id}`
  }

  if (component.element === 'el-row') {
    const initCols: Component[] = [
      {
        id: `key${props.id + 1}`,
        element: 'el-col',
        icon: '',
        name: '',
        type: 'container',
        span: 12,
        children: [],
      },
      {
        id: `key${props.id + 2}`,
        element: 'el-col',
        icon: '',
        name: '',
        type: 'container',
        span: 12,
        children: [],
      }
    ]

    proxy.$emit('update:id', props.id + 2)
    return {
      ...clonedComponent,
      // 消除子组件数据共享的问题，使得每个组件都独立初始化创建 https://github.com/tangllty/tang-vue/pull/8
      children: [...initCols]
    }
  }

  if (component.element === 'el-select') {
    const initOptions = [
      {
        label: '选项1',
        value: '1'
      },
      {
        label: '选项2',
        value: '2'
      }
    ]

    clonedComponent = {
      ...clonedComponent,
      options: [...initOptions]
    }
  }

  proxy.$emit('update:fieldId', props.fieldId + 1)
  return {
    ...clonedComponent,
    field: `field${props.fieldId}`
  }
}

useDraggable(componentRef, componentDataList, {
  animation: 150,
  ghostClass: 'ghost',
  group: {
    name: 'components',
    pull: 'clone',
    put: false
  },
  sort: false,
  clone: cloneComponent
})

const handleComponentClick = (item: Component) => {
  proxy.$emit('componentClick', cloneComponent(item))
}
</script>

<style lang="scss" scoped>
.dragging {
  height: 0 !important;
  border-top: 16px solid var(--el-color-primary) !important;
  margin: 0 4px !important;
  width: 100% !important;
  opacity: 0.75 !important;

  span {
    display: none !important;
  }
}

.component-container {
  display: flex;
  flex-wrap: wrap;

  .component {
    $componentWidth: 100px;
    $componentMargin: calc((100% - ($componentWidth * 2)) / 3);

    display: flex;
    align-items: center;
    cursor: move;
    border: 1px solid #e8e9eb;
    border-radius: 4px;
    width: 100px;
    transition: all 0.2s;

    &:nth-child(2n+1) {
      margin-left: calc($componentMargin / 2);
    }

    &:nth-child(2n) {
      margin-left: $componentMargin;
      margin-right: calc($componentMargin / 2);
    }

    + .component + .component {
      margin-top: 8px;
    }

    &:hover {
      background: #F1F2F3;
      border-color: var(--el-color-primary);
    }

    span {
      display: flex;
      align-items: center;
      justify-items: flex-start;
      height: 32px;
      line-height: 32px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;

      .icon {
        margin: 0 4px 0 8px;
      }
    }
  }
}
</style>
