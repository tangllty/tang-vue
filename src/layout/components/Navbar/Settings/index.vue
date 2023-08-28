<template>
  <el-drawer v-model="drawer">
    <template #header="{ titleId, titleClass }">
      <span class="header">系统设置</span>
    </template>
    <template #default>
      <el-divider>基础设置</el-divider>
      <div class="item">
        <span>主题设置</span>
        <ThemePicker />
      </div>
      <el-divider>导航栏设置</el-divider>
      <div class="item">
        <span>显示头部</span>
        <el-switch v-model="appStore.sidebarHeader" />
      </div>
      <div class="item">
        <span>侧边栏展开时显示 LOGO</span>
        <el-switch v-model="appStore.sidebarHeaderLogo" :disabled="!appStore.sidebarHeader" />
      </div>
      <div class="item">
        <span>固定头部</span>
        <el-switch v-model="appStore.fixedHeader" :disabled="!appStore.sidebarHeader" />
      </div>
    </template>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存配置</el-button>
      <el-button type="primary" @click="handleReset" plain>重置配置</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { computed, reactive, toRefs } from 'vue'
import { useToggle } from '@vueuse/core'
import { useAppStore } from '@/store/modules/app'
import { useSettingStore } from '@/store/modules/setting'
import { getProxy } from '@/utils/getCurrentInstance'
import ThemePicker from '@/components/ThemePicker/index.vue'

const proxy: any = getProxy()

const appStore = useAppStore()
const settingStore = useSettingStore()

const state = reactive({
  drawer: false
})

const {
  drawer
} = toRefs(state)

const sidebarHeader = computed({
  get: () => appStore.sidebarHeader,
  set: (value) => appStore.sidebarHeader = value
})

const sidebarHeaderLogo = computed({
  get: () => appStore.sidebarHeaderLogo,
  set: (value) => appStore.sidebarHeaderLogo = value
})

// 打开抽屉
const handleOpen = () => {
  drawer.value = true
}

// 关闭抽屉
const handleClose = () => {
  drawer.value = false
}

// 重置配置
const handleReset = () => {
  drawer.value = false
}

// 保存配置
const handleSubmit = () => {
  drawer.value = false
}

defineExpose({
  handleOpen
})
</script>

<style lang="scss" scoped>
.header {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-menu-text-color);
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
