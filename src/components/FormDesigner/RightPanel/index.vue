<template>
  <el-scrollbar>
    <el-form
      v-if="Object.keys(element).length"
      label-width="80px"
      class="pr-12 pl-12"
    >
      <el-collapse v-model="activeNames">
        <el-collapse-item title="系统属性" name="system">
          <template #title>
            <span>系统属性</span>
            <el-tooltip content="系统属性不可编辑" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-form-item v-if="hasOwnProperty(element, 'id')" label="唯一标识">
            <el-input v-model="element.id" readonly />
          </el-form-item>
          <el-form-item v-if="hasOwnProperty(element, 'element')" label="元素">
            <el-input v-model="element.element" readonly />
          </el-form-item>
          <el-form-item v-if="hasOwnProperty(element, 'field')" label="字段">
            <el-input v-model="element.field" readonly />
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="基础属性" name="base">
          <el-form-item v-if="hasOwnProperty(element, 'label')" label="标题">
            <el-input v-model="element.label" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item v-if="hasOwnProperty(element, 'labelVisible')" label="标题显隐">
            <el-radio-group v-model="element.labelVisible">
              <el-radio :label="true">显示</el-radio>
              <el-radio :label="false">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="hasOwnProperty(element, 'labelWidth')" label="标题宽度">
            <el-input-number
              v-model="element.labelWidth"
              :min="20"
              :max="200"
            />
          </el-form-item>
          <el-form-item v-if="hasOwnProperty(element, 'defaultValue')" label="默认值">
            <el-input v-model="element.defaultValue" placeholder="请输入默认值" />
          </el-form-item>
          <el-form-item v-if="hasOwnProperty(element, 'placeholder')" label="占位符">
            <el-input v-model="element.placeholder" placeholder="请输入占位符" />
          </el-form-item>
          <el-form-item v-if="hasOwnProperty(element, 'prepend')" label="前缀">
            <el-input v-model="element.prepend" placeholder="请输入前缀" />
          </el-form-item>
          <el-form-item v-if="hasOwnProperty(element, 'append')" label="后缀">
            <el-input v-model="element.append" placeholder="请输入后缀" />
          </el-form-item>
          <el-form-item v-if="hasOwnProperty(element, 'prefix')" label="前置图标">
            <el-popover
              trigger="click"
              placement="bottom-start"
              width="520"
            >
              <template #reference>
                <el-input v-model="element.prefix" placeholder="请输入前置图标">
                  <template #suffix>
                    <el-icon><SvgIcon :name="element.prefix" /></el-icon>
                  </template>
                </el-input>
              </template>
              <IconSelect @selected="(icon: string) => element.prefix = icon" />
            </el-popover>
          </el-form-item>
          <el-form-item v-if="hasOwnProperty(element, 'suffix')" label="后置图标">
            <el-popover
              trigger="click"
              placement="bottom-start"
              width="520"
            >
              <template #reference>
                <el-input v-model="element.suffix" placeholder="请输入后置图标">
                  <template #suffix>
                    <el-icon><SvgIcon :name="element.suffix" /></el-icon>
                  </template>
                </el-input>
              </template>
              <IconSelect @selected="(icon: string) => element.suffix = icon" />
            </el-popover>
          </el-form-item>
          <el-form-item v-if="hasOwnProperty(element, 'span')" label="栅格">
            <div
              class="flex flex-items-center"
              style="width: 80%"
            >
              <el-slider
                v-model="element.span"
                :min="1"
                :max="24"
                :marks="{ 6: '', 12: '', 18: '' }"
              />
            </div>
          </el-form-item>
          <div v-if="element.element === 'el-row'" label="栅格">
            <el-divider>栅格配置</el-divider>
            <div
              v-for="(col, index) in element.children"
              :key="col.id"
              class="flex flex-items-center"
              style="width: 80%"
            >
              <el-link
                :icon="Operation"
                :underline="false"
                class="mr-6"
                @click="proxy.$notImplemented"
              />
              <el-slider
                v-model="col.span"
                :min="1"
                :max="24"
                :marks="{ 6: '', 12: '', 18: '' }"
              />
              <el-link
                v-if="col"
                type="danger"
                :icon="Delete"
                :underline="false"
                class="ml-12"
                @click="element.children!.splice(index, 1)"
              />
            </div>
            <span class="block">总计: {{ element.children?.reduce((acc, cur) => acc + cur.span, 0) }}</span>
            <el-button @click="handleAddCol">
              添加列
            </el-button>
          </div>
          <div v-if="hasOwnProperty(element, 'options')">
            <el-divider>选项</el-divider>
            <div
              v-for="(option, index) in element.options"
              :key="index"
              class="flex"
            >
              <el-link
                :icon="Operation"
                :underline="false"
                class="mr-6"
                @click="proxy.$notImplemented"
              />
              <div class="mr-6">
                <el-input
                  v-model="option.label"
                  placeholder="请输入选项"
                />
              </div>
              <div class="mb-4">
                <el-input
                  v-model="option.value"
                  placeholder="请输入值"
                />
              </div>
              <el-link
                v-if="element.options"
                type="danger"
                :icon="Delete"
                :underline="false"
                class="ml-6"
                @click="element.options!.splice(index, 1)"
              />
            </div>

            <el-link
              v-if="element.options"
              type="primary"
              :icon="CirclePlus"
              :underline="false"
              class="mt-6"
              @click="element.options!.push({ label: '', value: '' })"
            >添加一级选项</el-link>
          </div>
          <div v-if="hasOwnProperty(element, 'cascaderOptions')">
            <el-divider>级联选项</el-divider>
            <el-tree
              style="max-width: 600px"
              :data="element.cascaderOptions"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
            >
              <template #default="{ node, data }">
                <span class="flex flex-items-center flex-justify-between flex-1">
                  <el-popover placement="top-start">
                    <template #reference>
                      <span
                        :class="{ 'c-red': !data.label || !data.value }"
                      >{{ data.label && data.value ? data.label : '悬浮编辑' }}</span>
                    </template>
                    <el-input
                      v-model="data.label"
                      placeholder="请输入选项"
                      class="mb-2"
                    />
                    <el-input
                      v-model="data.value"
                      placeholder="请输入值"
                    />
                  </el-popover>
                  <span>
                    <el-link
                      type="primary"
                      :icon="Plus"
                      :underline="false"
                      class="mr-4"
                      @click="handleCascaderAdd(data)"
                    />
                    <el-link
                      type="danger"
                      :icon="Delete"
                      :underline="false"
                      @click="handleCascaderDelete(node, data)"
                    />
                  </span>
                </span>
              </template>
            </el-tree>
            <el-link
              type="primary"
              :icon="CirclePlus"
              :underline="false"
              class="mt-8"
              @click="handleCascaderAddParent"
            >添加一级选项</el-link>
          </div>
          <el-form-item v-if="hasOwnProperty(element, 'text')" label="内容">
            <el-input v-model="element.text" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item v-if="hasOwnProperty(element, 'align')" label="对齐方式">
            <el-radio-group v-model="element.align" size="small">
              <el-radio-button label="left">居左</el-radio-button>
              <el-radio-button label="center">居中</el-radio-button>
              <el-radio-button label="right">居右</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="hasOwnProperty(element, 'fontSize')" label="字体大小">
            <el-input-number
              v-model="element.fontSize"
              size="small"
              class="mr-10"
            />px
          </el-form-item>
          <el-form-item v-if="hasOwnProperty(element, 'lineHeight')" label="行高">
            <el-input-number
              v-model="element.lineHeight"
              :precision="2"
              :step="0.5"
              size="small"
              class="mr-10"
            />倍
          </el-form-item>
          <div v-if="hasOwnProperty(element, 'code')">
            <el-divider>代码</el-divider>
            <FullScreen>
              <div style="height: 85vh;">
                <MonacoEditor v-model="element.code" language="html" />
              </div>
            </FullScreen>
            <el-input
              type="textarea"
              v-model="element.code"
              :rows="5"
              placeholder="请输入代码"
            />
          </div>
          <el-form-item v-if="hasOwnProperty(element, 'header')" label="卡片标题">
            <el-input v-model="element.header" placeholder="请输入卡片标题" />
          </el-form-item>
          <el-form-item v-if="hasOwnProperty(element, 'watermark')" label="水印">
            <el-input v-model="element.watermark" placeholder="请输入水印" />
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <div v-else class="flex flex-items-center flex-justify-center h-full">
      <el-empty description="请选中组件或点击左侧组件添加" />
    </div>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { CirclePlus, Delete, Operation, Plus } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../types'

const proxy = getProxy()

const props = defineProps({
  activeItem: {
    type: Object as PropType<Component>,
    default: () => ({})
  }
})

const state = reactive({
  activeNames: ['base'],
})

const {
  activeNames
} = toRefs(state)

const hasOwnProperty = (obj: Component, key: string) => Object.hasOwnProperty.call(obj, key)

const element = computed({
  get: () => props.activeItem,
  set: (val) => proxy.$emit('update:activeItem', val)
})

const handleAddCol = () => {
  if (element.value.element === 'el-row') {
    if (!element.value.children) {
      element.value.children = []
    }

    // 获取唯一标识
    let id: number = 0
    proxy.$emit('getId', (val: number) => id = val)

    const newCol = {
      id: `key${id}`,
      element: 'el-col',
      icon: '',
      name: '',
      type: 'container',
      span: 12,
      children: [],
    } as Component

    element.value.children.push(newCol)
  }
}

const handleCascaderAdd = (data: any) => {
  data.children = data.children || []
  data.children.push({
    label: '',
    value: '',
    children: []
  })
}

const handleCascaderDelete = (node: any, data: any) => {
  const parent = node.parent.data
  if (parent.children) {
    parent.children = parent.children.filter((item: any) => item !== data)
  } else if (element.value.cascaderOptions) {
    element.value.cascaderOptions = element.value.cascaderOptions.filter((item: any) => item !== data)
  }
}

const handleCascaderAddParent = () => {
  element.value.cascaderOptions = element.value.cascaderOptions || []
  element.value.cascaderOptions.push({
    label: '',
    value: '',
    children: []
  })
}
</script>

<style lang="scss" scoped>
</style>
