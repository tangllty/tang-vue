<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <el-sub-menu v-if="item.children && item.type === 'DIRECTORY'" :index="resolvePath(item.path)">
      <template #title>
        <el-icon>
          <svg-icon
            v-if="item.meta && item.meta.icon"
            :name="item.meta.icon"
          />
        </el-icon>
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

    <el-menu-item v-else-if="item.root && item.type === 'MENU'" :index="resolvePath(item.path)">
      <el-icon v-if="settingStore.sidebar">
        <svg-icon
          v-if="item.meta && item.meta.icon"
          :name="item.meta.icon"
        />
      </el-icon>
      <template #title>
        <el-icon>
          <svg-icon
            v-if="item.meta && item.meta.icon"
            :name="item.meta.icon"
          />
        </el-icon>
        <span>
          {{ item.meta.title }}
        </span>
      </template>
    </el-menu-item>

    <el-menu-item v-else :index="resolvePath('')">
      <template #title>
        <el-icon>
          <svg-icon
            v-if="item.meta && item.meta.icon"
            :name="item.meta.icon"
          />
        </el-icon>
        <span>
          {{ item.meta.title }}
        </span>
      </template>
    </el-menu-item>
  </div>
</template>

<script lang="ts" setup>
import { useSettingStore } from '@/store/modules/setting'
import { resolve } from '@/utils/path'

const settingStore = useSettingStore()

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

/**
 * 获取路由的绝对路径
 *
 * @param routePath 路由路径
 */
const resolvePath = (routePath: string) => {
  return resolve(props.basePath, routePath)
}
</script>

<style lang="scss" scoped>
</style>
