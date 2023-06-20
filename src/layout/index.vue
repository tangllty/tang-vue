<template>
  <el-container :class="appWrapper" class="app-wrapper">
    <el-aside class="sidebar-container">
      <el-header class="logo">
        <transition>
          <router-link
            class="logo-link"
            to="/index"
            v-if="title"
          >
            <el-image :src="logo" class="logo-image" />
          </router-link>
          <router-link
            class="logo-link"
            to="/index"
            v-else
          >
            <el-image :src="logo" class="logo-image" />
            <span v-show="!title" class="logo-title">后台管理系统</span>
          </router-link>
        </transition>
      </el-header>
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
import Sidebar from '@/layout/components/Sidebar/index.vue'
import Navbar from '@/layout/components/Navbar/index.vue'
import AppMain from '@/layout/components/AppMain/index.vue'
import { useAppStore } from '@/store/modules/app'
import logo from '@/assets/logo.png'

const appStore = useAppStore()

const title = computed(() => appStore.sidebar)

const appWrapper = computed(() => ({
  expandSidebar: !appStore.sidebar,
  foldSidebar: appStore.sidebar
}))
</script>

<style lang="scss" scoped>
.logo {
  padding-left: 0;

  .logo-link {
    display: flex;
    height: 50px;
    align-items: center;
    justify-content: center;
    color: black;
    font-weight: 600;
  }

  .logo-image {
    width: 30px;
    height: 30px;
    border: 1px solid rgb(194, 194, 194);
  }

  .logo-title {
    margin-left: .75rem;
    color: var(--el-menu-text-color);
  }
}

.v-enter-active {
  transition: opacity 1200ms ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
