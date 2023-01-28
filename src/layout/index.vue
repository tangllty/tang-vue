<template>
  <el-container :class="appWrapper" class="app-wrapper">
    <el-aside width="200px" class="sidebar-container">
      <el-header style="background-color: aliceblue;">
        Aside-header
      </el-header>
      <Sidebar class="sidebar" />
    </el-aside>
    <el-container class="app-container">
      <el-header class="header-container" style="background-color: azure;">
        <Navbar />
      </el-header>
      <el-main class="main-container">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Sidebar from '@/layout/components/Sidebar/index.vue'
import Navbar from '@/layout/components/Navbar/index.vue'
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore()

const appWrapper = computed(() => ({
  expandSidebar: !appStore.sidebar,
  foldSidebar: appStore.sidebar
}))
</script>

<style lang="scss" scoped>
</style>
