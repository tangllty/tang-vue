<template>
  <el-color-picker
    v-model="theme"
    @active-change="handleActiveChange"
    @change="handleChange"
  />
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { useSettingStore } from '@/store/modules/setting'
import { getProxy } from '@/utils/getCurrentInstance'
import { removeTheme, saveTheme, setTheme } from '@/utils/theme'

const proxy: any = getProxy()

const settingStore = useSettingStore()

const state = reactive({
  theme: settingStore.theme
})

const {
  theme
} = toRefs(state)

const handleActiveChange = (color: string | null) => {
  if (!color) {
    removeTheme()
    return
  }
  setTheme(color)
}

const handleChange = (color: string | null) => {
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
