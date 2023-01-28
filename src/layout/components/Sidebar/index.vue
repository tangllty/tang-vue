<template>
  <el-scroller always = "true">
    <el-menu
      :default-active="activeMenu"
      router
      unique-opened
      :collapse="isCollapse"
    >
      <el-menu-item index="/index">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-sub-menu index="/system">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>系统管理</span>
        </template>
        <el-menu-item index="/system/user">用户管理</el-menu-item>
        <el-menu-item index="/system/dept">部门管理</el-menu-item>
        <el-menu-item index="/system/role">角色管理</el-menu-item>
        <el-menu-item index="/system/menu">菜单管理</el-menu-item>
        <el-sub-menu index="/system/log">
          <template #title>日志管理</template>
          <el-menu-item index="/system/log/login">登陆日志</el-menu-item>
          <el-menu-item index="/system/log/oper">操作日志</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
    </el-menu>
  </el-scroller>
</template>

<script lang="ts" setup>
import { House, Setting, Histogram } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
const route = useRoute()

const isCollapse = computed(() => appStore.sidebar)

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path
})
</script>

<style lang="scss">
</style>
