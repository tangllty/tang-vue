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

      <Breadcrumb class="ml-10" />
    </div>

    <div class="right-div">
      <el-switch
        v-model="isDark"
        @change="toggleDark"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        class="mr-10"
      />
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <el-image :src="userStore.user.avatar" class="user-avatar" />
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-link :underline="false" @click="proxy.$router.push({ path: '/profile' })">个人中心</el-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-link href="https://github.com/tangllty/tang-vue" target="_blank">GitHub</el-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-link href="https://gitee.com/tangllty/tang-vue" target="_blank">Gitee</el-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-link href="https://tangllty.eu.org" target="_blank">文档</el-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-link :underline="false" @click="handleSettings">系统设置</el-link>
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <Settings ref="settingsRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Expand, Fold, ArrowDown, Moon, Sunny } from '@element-plus/icons-vue'
import { useDark, useToggle } from '@vueuse/core'
import { useAppStore } from '@/store/modules/app'
import { useSettingStore } from '@/store/modules/setting'
import { useUserStore } from '@/store/modules/user'
import { getProxy } from '@/utils/getCurrentInstance'
import Breadcrumb from './Breadcrumb/index.vue'
import Settings from './Settings/index.vue'

const proxy: any = getProxy()

const appStore = useAppStore()
const settingStore = useSettingStore()
const userStore = useUserStore()
const isDark = useDark()

const settingsRef = ref<InstanceType<typeof Settings>>()

const toggleDark = () => useToggle(isDark)

watch(isDark, (value) => {
  settingStore.isDark = value
  settingStore.flashTheme()
})

const toggleSidebar = () => {
  appStore.sidebar = !appStore.sidebar
}

const handleSettings = () => {
  settingsRef.value?.handleOpen()
}

const logout = async () => {
  try {
    await proxy.$confirm('确定注销并退出系统吗？', '提示', {
      type: 'warning'
    })
    await userStore.logout()
    await proxy.$router.push({ path: '/login' })
  } catch (error) {
    console.log(error)
  }
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
