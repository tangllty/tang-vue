<template>
  <el-config-provider :locale="locale" :size="size">
    <RouterView />
  </el-config-provider>
</template>

<script lang="ts" setup>
import type { EpPropMergeType } from 'element-plus/es/utils'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()

const locale = computed(() => appStore.elementPlusLocale)

// Element 大小类型
type ElementPlusSize = EpPropMergeType<StringConstructor, '' | 'default' | 'small' | 'large', never>

const size = computed(() => appStore.size as ElementPlusSize)
</script>

<style lang="scss" scoped>
</style>
