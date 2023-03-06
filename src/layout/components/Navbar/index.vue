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

    <div>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <el-image :src="userAvatar" class="user-avatar" />
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <a target="_blank" href="https://github.com/tangllty/tang-ui">
              <el-dropdown-item>GitHub</el-dropdown-item>
            </a>
            <a target="_blank" href="https://gitee.com/tangllty/tang-ui">
              <el-dropdown-item>Gitee</el-dropdown-item>
            </a>
            <el-dropdown-item disabled>文档</el-dropdown-item>
            <el-dropdown-item divided @click="logout">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router'
import { ElMessageBox } from 'element-plus'
import { Expand, Fold, ArrowDown } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'

import userAvatar from '@/assets/logo.png'

const appStore = useAppStore()
const userStore = useUserStore()

function toggleSidebar() {
  appStore.sidebar = !appStore.sidebar
}

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    type: 'warning'
  }).then(() => {
    userStore.logout().then(() => {
      router.push({ path: '/login' })
    })
  })
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  margin-bottom: 20px;
  display:flex;
  justify-content:space-between;
  align-items: center;

  .hamburger-container {
    cursor: pointer;
    height: 100%;
    line-height: 50px;

    .el-icon {
      font-size: 26px;
    }
  }

  div {
    width: auto;
    display:flex;
    justify-content:space-between;
    align-items: center;

    .user-avatar {
      width: 40px;
      height: 40px;
      display: inline-block;
      border-radius: .5rem;
      border: 1px solid #ccc;
      margin-left: 0px;
    }
  }
}
</style>
