<template>
  <div class="navbar">
    <div class="left-div">
      <el-radio-group
        v-model="settingStore.sidebar"
        class="hamburger-container"
        @click="toggleSidebar"
      >
        <el-icon v-show="!settingStore.sidebar"><Expand /></el-icon>
        <el-icon v-show="settingStore.sidebar"><Fold /></el-icon>
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
      <LangSelect class="mr-10" />
      <SizeSelect class="mr-10" />
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
              <el-link :underline="false" @click="proxy.$router.push({ path: '/profile' })">{{ $t('layout.profile') }}</el-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-link href="https://github.com/tangllty/tang-vue" target="_blank">GitHub</el-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-link href="https://gitee.com/tangllty/tang-vue" target="_blank">Gitee</el-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-link href="https://tangllty.eu.org" target="_blank">{{ $t('layout.documentation') }}</el-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-link :underline="false" @click="handleSettings">{{ $t('layout.settings') }}</el-link>
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">{{ $t('layout.logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <Settings ref="settingsRef" />
  </div>
</template>

<script lang="ts" setup>
import { Expand, Fold, ArrowDown, Moon, Sunny } from '@element-plus/icons-vue'
import { useDark, useToggle } from '@vueuse/core'
import { useSettingStore } from '@/store/modules/setting'
import { useUserStore } from '@/store/modules/user'
import { getProxy } from '@/utils/getCurrentInstance'
import type { SettingsInstance } from './instance'
import Breadcrumb from './Breadcrumb/index.vue'
import Settings from './Settings/index.vue'
import SizeSelect from './SizeSelect/index.vue'
import LangSelect from './LangSelect/index.vue'

const proxy = getProxy()

const settingStore = useSettingStore()
const userStore = useUserStore()
const isDark = useDark()

const settingsRef = ref<SettingsInstance>()

const toggleDark = () => useToggle(isDark)

watch(isDark, (value) => {
  settingStore.isDark = value
  settingStore.flashTheme()
})

/**
 * 切换侧边栏
 */
const toggleSidebar = () => {
  settingStore.sidebar = !settingStore.sidebar
}

/**
 * 打开设置抽屉
 */
const handleSettings = () => {
  settingsRef.value?.handleOpen()
}

/**
 * 退出登录
 */
const logout = async () => {
  try {
    await proxy.$confirm(proxy.$t('layout.logoutConfirm.message'), proxy.$t('layout.logoutConfirm.title'), {
      type: 'warning'
    })
    await userStore.logout()
    await proxy.$router.push({ path: '/login', query: { redirect: proxy.$route.fullPath } })
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .right-div {
    width: auto;
    display: flex;
    justify-content: space-between;
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
