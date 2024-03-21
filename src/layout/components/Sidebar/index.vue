<template>
  <el-menu
    :default-active="activeMenu"
    router
    unique-opened
    :collapse="isCollapse"
    :collapse-transition="false"
  >
    <el-menu-item index="/index">
      <el-icon><svg-icon name="首页" /></el-icon>
      <span>首页</span>
    </el-menu-item>

    <SidebarItem
      v-for="route in permissionStore.routes"
      :item="route"
      :key="route.path"
      :base-path="route.path"
    />
  </el-menu>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useSettingStore } from '@/store/modules/setting'
import { usePermissionStore } from '@/store/modules/permission'
import SidebarItem from '@/layout/components/Sidebar/SidebarItem.vue'

const route = useRoute()
const settingStore = useSettingStore()
const permissionStore = usePermissionStore()

const isCollapse = computed((): boolean => settingStore.sidebar)

/**
 * 通过路由的 meta.activeMenu 属性来判断当前路由是否激活
 */
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path
})
</script>

<style lang="scss" scoped>
.el-menu {
  border-right: none;
}
</style>
