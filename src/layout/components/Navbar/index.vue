<template>
  <div class="navbar">
    <div class="left-div">
      <el-radio-group
        v-model="appStore.sidebar"
        class="hamburger-container"
        @click="toggleSidebar"
      >
        <el-icon v-show="!appStore.sidebar"><Expand /></el-icon>
        <el-icon v-show="appStore.sidebar"><Fold /></el-icon>
      </el-radio-group>

      <Breadcrumb style="margin-left: 10px;" />
    </div>

    <div class="right-div">
      <el-switch
        v-model="isDark"
        @change="toggleDark"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        style="margin-right: 10px;"
      />
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <el-image :src="userAvatar" class="user-avatar" />
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-link :underline="false">
                <router-link to="/profile">个人中心</router-link>
              </el-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-link href="https://github.com/tangllty/tang-ui" target="_blank">GitHub</el-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-link href="https://gitee.com/tangllty/tang-ui" target="_blank">Gitee</el-link>
            </el-dropdown-item>
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
import { getCurrentInstance } from 'vue'
import { Expand, Fold, ArrowDown, Moon, Sunny } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { useDark, useToggle } from '@vueuse/core'
import Breadcrumb from './Breadcrumb/index.vue'

import userAvatar from '@/assets/logo.png'

const { proxy }: any = getCurrentInstance()

const appStore = useAppStore()
const userStore = useUserStore()
const isDark = useDark()
const toggleDark = () => useToggle(isDark)

function toggleSidebar() {
  appStore.sidebar = !appStore.sidebar
}

function logout() {
  proxy.$confirm('确定注销并退出系统吗？', '提示', {
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

  .left-div {
    width: auto;
    display:flex;
    justify-content:space-between;
    align-items: center;
  }

  .right-div {
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
      margin-left: 0;
    }
  }
}
</style>
