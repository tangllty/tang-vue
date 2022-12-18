<template>
  <el-container class="app-wrapper">
    <el-aside width="200px" class="sidebar-container">
      <el-header style="background-color: aliceblue;">
        Aside-header
      </el-header>
      <Sidebar class="sidebar" />
    </el-aside>
    <el-container class="app-container">
      <el-header class="header-container" style="background-color: azure;">
        Header
      </el-header>
      <el-main class="main-container">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Sidebar from '@/layout/components/Sidebar/index.vue'
</script>

<style lang="scss" scoped>
</style>
