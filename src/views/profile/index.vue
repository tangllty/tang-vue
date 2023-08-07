<template>
  <el-row>
    <el-col :span="4">
      <el-card>
        <div>
          <Avatar />
          <el-text
            size="large"
            tag="b"
            truncated
            class="ml-10"
          >{{ userStore.user.nickname }}</el-text>
        </div>
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
import { useRoute } from 'vue-router'
import { House, Menu } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import Avatar from './Avatar.vue'

const route = useRoute()
const userStore = useUserStore()

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
