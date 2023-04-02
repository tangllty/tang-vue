<template>
  <el-row class="tac">
    <el-col :span="4">
      <el-card style="padding: 0;">
        <el-image :src="userAvatar" class="user-avatar" />
        糖猫猫
        <el-menu
          :default-active="activeMenu"
          router
        >
          <el-menu-item index="/profile/info">
            <el-icon><House /></el-icon>
            <span>个人资料</span>
          </el-menu-item>
          <el-menu-item index="/profile/login-log">
            <el-icon><Menu /></el-icon>
            <span>登陆历史</span>
          </el-menu-item>
        </el-menu>
      </el-card>
    </el-col>
    <el-col :span="20">
      <RouterView />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { House, Menu } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

import userAvatar from '@/assets/logo.png'

const route = useRoute()

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path
})
</script>

<style lang="scss" scoped>
.user-avatar {
  width: 60px;
  border-radius: 12%;
  border: 1px solid #cccccc;
}
</style>
