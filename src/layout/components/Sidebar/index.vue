<template>
  <el-scroller always = "true">
    <el-menu
      :default-active="activeMenu"
      router
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
    >
      <el-menu-item index="/index">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>

      <SidebarItem
        v-for="route in permissionStore.routes"
        :item="route"
        :key="route.path"
        :base-path="route.path"
      />
    </el-menu>
  </el-scroller>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import SidebarItem from '@/layout/components/Sidebar/SidebarItem.vue'

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const isCollapse = computed(() => appStore.sidebar)

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path
})
</script>

<style lang="scss" scoped>
</style>
