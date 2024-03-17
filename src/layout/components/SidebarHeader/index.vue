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
        <span v-show="!title" class="logo-title">{{ settings.title }}</span>
      </Transition>
    </router-link>
  </el-header>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import logo from '@/assets/logo.png'
import settings from '@/settings'

const appStore = useAppStore()

const sidebarHeader = computed(() => appStore.sidebarHeader)
const sidebarHeaderLogo = computed(() => appStore.sidebarHeaderLogo)
const title = computed(() => appStore.sidebar)
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.logo {
  height: $headerHeight;
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
