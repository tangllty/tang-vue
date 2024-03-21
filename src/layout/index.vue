<template>
  <el-container :class="appWrapper" class="app-wrapper">
    <el-aside class="sidebar-container">
      <SidebarHeader v-if="fixedHeader" />
      <el-scrollbar class="sidebar" v-if="fixedHeader">
        <Sidebar />
      </el-scrollbar>

      <el-scrollbar v-else>
        <SidebarHeader />
        <Sidebar />
      </el-scrollbar>
    </el-aside>
    <el-container class="app-container">
      <el-header class="header-container">
        <Navbar />
      </el-header>
      <el-main class="main-container">
        <AppMain />
        <el-backtop
          target=".main-container"
          :visibility-height="200"
          :right="50"
          :bottom="50"
        />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { useSettingStore } from '@/store/modules/setting'
import SidebarHeader from '@/layout/components/SidebarHeader/index.vue'
import Sidebar from '@/layout/components/Sidebar/index.vue'
import Navbar from '@/layout/components/Navbar/index.vue'
import AppMain from '@/layout/components/AppMain/index.vue'

const settingStore = useSettingStore()

const appWrapper = computed(() => ({
  expandSidebar: !settingStore.sidebar,
  foldSidebar: settingStore.sidebar
}))

const fixedHeader = computed(() => settingStore.fixedHeader)
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-wrapper {
  height: 100%;

  .sidebar-container {
    box-shadow: 2px 0 6px 2px rgba(0, 0, 0, .18);
    z-index: 1001;
    overflow: hidden;

    .sidebar {
      height: calc(100% - #{$headerHeight});
    }
  }

  .app-container {
    .header-container {
      height: $headerHeight;
      box-shadow: 0 2px 6px 2px rgba(0, 0, 0, .08);
    }

    .main-container {
      overflow-x: hidden;
    }
  }
}
</style>
