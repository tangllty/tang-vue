<template>
  <el-dropdown
    trigger="click"
    @command="handleSize"
  >
    <el-icon size="24"><svg-icon name="组件大小" /></el-icon>
    <template #dropdown>
      <el-dropdown-menu
        v-for="size in sizes"
        :key="size.key"
      >
        <el-dropdown-item
          :command="size.key"
          :key="size.key"
          :disabled="disabled(size.key)"
        >
          <el-link
            :underline="false"
            :disabled="disabled(size.key)"
          >{{ size.title }}</el-link>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { getProxy } from '@/utils/getCurrentInstance'

const proxy = getProxy()

const appStore = useAppStore()

const sizes = [
  {
    key: 'large',
    title: proxy.$t('size.large')
  },
  {
    key: 'default',
    title: proxy.$t('size.default')
  },
  {
    key: 'small',
    title: proxy.$t('size.small')
  }
]

/**
 * 切换组件大小
 *
 * @param key 语言 key
 */
const handleSize = (key: string): void => {
  appStore.size = key
}

const disabled = (key: string): boolean => {
  return appStore.size == key
}
</script>

<style lang="scss" scoped>
</style>
