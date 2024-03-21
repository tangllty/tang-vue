<template>
  <el-config-provider :locale="locale" :size="size">
    <RouterView />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { useSettingStore } from '@/store/modules/setting'
import type { ElementPlusSize } from '@/types'

const settingStore = useSettingStore()

const locale = computed(() => settingStore.elementPlusLocale)
const size = computed(() => settingStore.size as ElementPlusSize)
</script>

<style lang="scss" scoped>
</style>
