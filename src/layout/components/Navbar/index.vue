<template>
  <div class="navbar">
    <el-radio-group
      v-model="appStore.sidebar"
      class="hamburger-container"
      @click="toggleSidebar"
    >
      <el-icon v-show="!appStore.sidebar"><Expand /></el-icon>
      <el-icon v-show="appStore.sidebar"><Fold /></el-icon>
    </el-radio-group>
  </div>
</template>

<script lang="ts" setup>
import { Expand, Fold } from '@element-plus/icons-vue'
import { useAppStore } from "@/store/modules/app"

const appStore = useAppStore()

function toggleSidebar() {
  appStore.sidebar = !appStore.sidebar
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  margin-bottom: 20px;

  .hamburger-container {
    cursor: pointer;
    height: 100%;
    line-height: 50px;

    .el-icon {
      font-size: 26px;
    }
  }
}
</style>
