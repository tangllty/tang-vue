<template>
  <el-dropdown
    trigger="click"
    @command="handleLanguage"
  >
    <el-icon size="24"><svg-icon name="语言" /></el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="lang in langs"
          :key="lang.key"
          :command="lang.key"
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
import { useSettingStore } from '@/store/modules/setting'
import { langs } from '@/locales'

const settingStore = useSettingStore()
const { locale } = useI18n()

/**
 * 切换语言
 *
 * @param key 语言 key
 */
const handleLanguage = (key: string): void => {
  locale.value = key
  settingStore.language = key
}

const disabled = (key: string): boolean => {
  return settingStore.language == key
}
</script>

<style lang="scss" scoped>
</style>
