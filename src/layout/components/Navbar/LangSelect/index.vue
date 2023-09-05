<template>
  <el-dropdown
    trigger="click"
    @command="handleLanguage"
  >
    <el-icon size="24"><svg-icon name="语言" /></el-icon>
    <template #dropdown>
      <el-dropdown-menu
        v-for="lang in langs"
        :key="lang.key"
      >
        <el-dropdown-item
          :command="lang.key"
          :key="lang.key"
          :disabled="disabled(lang.key)"
        >
          <el-link
            :underline="false"
            :disabled="disabled(lang.key)"
          >{{ lang.title }}</el-link>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/modules/app'
import { langs, flashLocale } from '@/locales'

const appStore = useAppStore()
const { locale } = useI18n()

const handleLanguage = (key: string): void => {
  locale.value = key
  appStore.language = key
  flashLocale()
}

const disabled = (key: any): boolean => {
  return appStore.language == key
}
</script>

<style lang="scss" scoped>
</style>
