<template>
  <iframe
    :src="url"
    frameborder="no"
    style="height: 100%; width: 100%;"
  />
</template>

<script lang="ts" setup>
import { getProxy } from '@/utils/getCurrentInstance'

const proxy = getProxy()

const state = reactive({
  url: import.meta.env.VITE_APP_BASE_API + '/druid'
})

const {
  url
} = toRefs(state)
</script>

<style lang="scss" scoped>
</style>
