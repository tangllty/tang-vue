<template>
  <el-config-provider :locale="locale" :size="size">
    <RouterView />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import type { ElementPlusSize } from '@/types'

const appStore = useAppStore()

const locale = computed(() => appStore.elementPlusLocale)

const size = computed(() => appStore.size as ElementPlusSize)
</script>

<style lang="scss" scoped>
</style>
