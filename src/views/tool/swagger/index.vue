<template>
  <iframe
    :src="url"
    frameborder="0"
    width="100%"
    height="100%"
  ></iframe>
</template>

<script lang="ts" setup>
const state = reactive({
  url: import.meta.env.VITE_APP_URL + '/api-docs',
})

const {
  url
} = toRefs(state)
</script>

<style lang="scss" scoped>
</style>
