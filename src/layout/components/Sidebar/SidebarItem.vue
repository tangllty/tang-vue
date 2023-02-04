<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <el-sub-menu v-if="item.children" :index="resolvePath(item.path)">
      <template #title>
        <component
          v-if="item.meta && item.meta.icon"
          class="icon"
          :is="item.meta.icon"
        />
        <span class="title-span">
          {{ item.meta.title }}
        </span>
      </template>

      <SidebarItem
        v-for="children in item.children"
        :item="children"
        :key="children.path"
        :base-path="resolvePath(children.path)"
      />
    </el-sub-menu>

    <el-menu-item v-else :index="resolvePath('')">
      <template #title>
        <component
          v-if="item.meta && item.meta.icon"
          class="icon"
          :is="item.meta.icon"
        />
        <span>
          {{ item.meta.title }}
        </span>
      </template>
    </el-menu-item>
  </div>
</template>

<script lang="ts" setup>
import path from 'path-browserify'
import { ElSubMenu, ElMenuItem } from 'element-plus'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
    required: true
  }
})

function resolvePath(routePath: string) {
  return path.resolve(props.basePath, routePath)
}
</script>

<style lang="scss" scoped>
</style>
