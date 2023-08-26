<template>
  <el-container :class="appWrapper" class="app-wrapper">
    <el-aside class="sidebar-container">
      <SidebarHeader />
      <Sidebar class="sidebar" />
    </el-aside>
    <el-container class="app-container">
      <el-header class="header-container">
        <Navbar />
      </el-header>
      <el-main class="main-container">
        <AppMain />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import SidebarHeader from '@/layout/components/SidebarHeader/index.vue'
import Sidebar from '@/layout/components/Sidebar/index.vue'
import Navbar from '@/layout/components/Navbar/index.vue'
import AppMain from '@/layout/components/AppMain/index.vue'

const appStore = useAppStore()

const appWrapper = computed(() => ({
  expandSidebar: !appStore.sidebar,
  foldSidebar: appStore.sidebar
}))
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-wrapper {
  height: 100%;

  .sidebar-container {
    box-shadow: 2px 0 6px 2px rgba(0, 0, 0, .18);
    z-index: 1001;
    overflow-x: hidden;
  }

  .app-container {
    .header-container {
      height: $headerHeight;
      box-shadow: 0 2px 6px 2px rgba(0, 0, 0, .08);
    }
  }
}
</style>
