<template>
  <el-scrollbar>
    <el-form
      label-width="80px"
      class="pr-8 pl-8"
    >
      <el-form-item v-if="hasOwnProperty(element, 'id')" label="唯一标识">
        <el-input v-model="element.id" readonly />
      </el-form-item>
      <el-form-item v-if="hasOwnProperty(element, 'element')" label="元素">
        <el-input v-model="element.element" readonly />
      </el-form-item>
      <el-form-item v-if="hasOwnProperty(element, 'label')" label="标题">
        <el-input v-model="element.label" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item v-if="hasOwnProperty(element, 'labelWidth')" label="标题宽度">
        <el-input-number
          v-model="element.labelWidth"
          :min="20"
          :max="200"
        />
      </el-form-item>
      <el-form-item v-if="hasOwnProperty(element, 'field')" label="字段">
        <el-input v-model="element.field" readonly />
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
        <el-slider
          v-model="element.span"
          :min="1"
          :max="24"
          :marks="{ 6: '', 12: '', 18: '' }"
        />
      </el-form-item>
      <el-button v-if="element.element === 'el-row'" @click="handleAddCol">
        添加列
      </el-button>
      <div v-if="hasOwnProperty(element, 'options')">
        <el-divider>选项</el-divider>
        <div v-for="(option, index) in element.options" :key="index">
          <el-button
            :icon="Operation"
            circle
            class="mr-6"
            @click="proxy.$notImplemented"
          />
          <div class="inline-block mr-6" style="width: 80px;">
            <el-input
              v-model="option.label"
              placeholder="请输入选项"
            />
          </div>
          <div class="inline-block mb-2" style="width: 80px;">
            <el-input
            v-model="option.value"
            placeholder="请输入值"
          />
          </div>
          <el-button
            v-if="element.options"
            type="danger"
            :icon="Delete"
            circle
            class="ml-6"
            @click="element.options.splice(index, 1)"
          />
        </div>

        <el-button
          v-if="element.options"
          type="primary"
          @click="element.options.push({ label: '', value: '' })"
        >
          添加选项
        </el-button>
      </div>
    </el-form>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { Delete, Operation } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import type { Component } from '../types'

const proxy = getProxy()

const props = defineProps({
  activeItem: {
    type: Object as PropType<Component>,
    default: () => ({})
  }
})

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

    const newCol = {
      id: '',
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
</script>

<style lang="scss" scoped>
</style>
