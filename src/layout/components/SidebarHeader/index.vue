<template>
  <el-header v-if="sidebarHeader" class="logo">
    <router-link
      class="logo-link"
      to="/index"
      :style="{
        width: sidebarHeaderLogo ? 'auto' : '100%',
        justifyContent: sidebarHeaderLogo ? 'flex-start' : 'center'
      }"
    >
      <el-image
        v-if="sidebarHeaderLogo"
        :src="logo"
        class="logo-image"
      />
      <Transition>
        <span v-show="!title" class="logo-title">{{ $t('title') }}</span>
      </Transition>
    </router-link>
  </el-header>
</template>

<script lang="ts" setup>
import { useSettingStore } from '@/store/modules/setting'
import logo from '@/assets/logo.png'

const settingStore = useSettingStore()

const sidebarHeader = computed(() => settingStore.sidebarHeader)
const sidebarHeaderLogo = computed(() => settingStore.sidebarHeaderLogo)
const title = computed(() => settingStore.sidebar)
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss';

.logo {
  height: variables.$headerHeight;
  padding: 0 1rem;

  .logo-link {
    display: flex;
    height: 50px;
    align-items: center;
    justify-content: center;
    color: black;
    font-weight: 600;

    .logo-image {
      width: 30px;
      height: 30px;
      border: 1px solid rgb(194, 194, 194);
      flex-shrink: 0;
    }

    .logo-title {
      margin: 0 auto;
      color: var(--el-menu-text-color);
      text-wrap: nowrap;
    }
  }
}

.v-leave-active {
  transition: opacity 80ms ease;
}

.v-leave-from {
  opacity: 1;
}

.v-leave-to {
  opacity: 0;
}

.v-enter-active {
  transition: opacity 180ms ease 180ms;
}

.v-enter-from {
  opacity: 0;
}

.v-enter-to {
  opacity: 1;
}
</style>
