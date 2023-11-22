<template>
  <el-color-picker
    v-model="theme"
    :predefine="predefineColors"
    @active-change="handleActiveChange"
    @change="handleChange"
  />
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { useSettingStore } from '@/store/modules/setting'
import { removeTheme, saveTheme, setTheme } from '@/utils/theme'

const settingStore = useSettingStore()

const state = reactive({
  theme: settingStore.theme,
  // https://flatuicolors.com/
  predefineColors: [
    '#409eff',
    '#00ced1',
    '#1abc9c',
    '#16a085',
    '#90ee90',
    '#2ecc71',
    '#27ae60',
    '#3498db',
    '#2980b9',
    '#722ed1',
    '#9b59b6',
    '#8e44ad',
    '#34495e',
    '#2c3e50',
    '#f1c40f',
    '#f39c12',
    '#e67e22',
    '#d35400',
    '#fd726d',
    '#e74c3c',
    '#c0392b',
    '#ecf0f1',
    '#bdc3c7',
    '#95a5a6',
    '#7f8c8d'
  ]
})

const {
  theme,
  predefineColors
} = toRefs(state)

// 面板中显示的颜色发生改变时触发
const handleActiveChange = (color: string | null): void => {
  if (!color) {
    removeTheme()
    return
  }
  setTheme(color)
}

// 绑定值发生改变时触发
const handleChange = (color: string | null): void => {
  if (!color) {
    removeTheme()
    return
  }
  saveTheme(color)
  settingStore.theme = color
}
</script>

<style lang="scss" scoped>
</style>
