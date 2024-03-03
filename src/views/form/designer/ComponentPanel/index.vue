<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item
      v-for="group in componentGroupList"
      :key="group.name"
      :title="group.name"
      :name="group.name"
    >
      <template #title>
        <span class="ml-8 font-bold">
          <el-icon class="mr-4">
            <SvgIcon :name="group.icon" />
          </el-icon>
          {{ group.name }}
        </span>
      </template>
      <ComponentList
        :componentList="group.list"
        v-model:id="id"
        v-model:fieldId="fieldId"
        @componentClick="handleComponentClick"
      />
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts" setup>
import { getProxy } from '@/utils/getCurrentInstance'
import { componentGroupList, groupNames } from './data'
import type { Component } from '../types'
import ComponentList from './ComponentList.vue'

const proxy = getProxy()

const state = reactive({
  activeNames: groupNames,
  id: 1,
  fieldId: 1
})

const {
  activeNames,
  id,
  fieldId
} = toRefs(state)

const handleComponentClick = (item: Component) => {
  proxy.$emit('componentClick', item)
}
</script>

<style lang="scss" scoped>
</style>
