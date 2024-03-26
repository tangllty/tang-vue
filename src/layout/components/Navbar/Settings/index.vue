<template>
  <el-drawer v-model="drawer">
    <template #header>
      <span class="header">{{ $t('settings.title') }}</span>
    </template>
    <template #default>
      <el-divider>{{ $t('settings.basic.title') }}</el-divider>
      <div class="item">
        <span>{{ $t('settings.basic.theme') }}</span>
        <ThemePicker />
      </div>
      <div class="item">
        <span>色弱模式</span>
        <el-switch v-model="settingStore.isWeak" />
      </div>
      <el-divider>{{ $t('settings.sidebar.title') }}</el-divider>
      <div class="item">
        <span>{{ $t('settings.sidebar.showHeader') }}</span>
        <el-switch v-model="settingStore.sidebarHeader" />
      </div>
      <div class="item">
        <span>{{ $t('settings.sidebar.showLogo') }}</span>
        <el-switch v-model="settingStore.sidebarHeaderLogo" :disabled="!settingStore.sidebarHeader" />
      </div>
      <div class="item">
        <span>{{ $t('settings.sidebar.fixedHeader') }}</span>
        <el-switch v-model="settingStore.fixedHeader" :disabled="!settingStore.sidebarHeader" />
      </div>
    </template>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存配置</el-button>
      <el-button
        type="primary"
        @click="handleReset"
        plain
      >重置配置</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { useSettingStore } from '@/store/modules/setting'

const settingStore = useSettingStore()

const state = reactive({
  drawer: false
})

const {
  drawer
} = toRefs(state)

/**
 * 打开抽屉
 */
const handleOpen = () => {
  drawer.value = true
}

/**
 * 关闭抽屉
 */
const handleClose = () => {
  drawer.value = false
}

/**
 * 重置配置
 */
const handleReset = () => {
  drawer.value = false
}

/**
 * 保存配置
 */
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
