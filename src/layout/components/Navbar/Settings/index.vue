<template>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>系统设置</h4>
    </template>
    <template #default>
      <div>
        <h4>主题设置</h4>
        <ThemePicker />
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
import { reactive, toRefs } from 'vue'
import { useSettingStore } from '@/store/modules/setting'
import { getProxy } from '@/utils/getCurrentInstance'
import ThemePicker from '@/components/ThemePicker/index.vue'

const proxy: any = getProxy()

const settingStore = useSettingStore()

const state = reactive({
  drawer: false
})

const {
  drawer
} = toRefs(state)

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
</style>
