<template>
  <highlightjs
    :code="code"
    :language="language"
    :autodetect="autodetect"
    :ignore-illegals="ignoreIllegals"
  />
</template>

<script lang="ts" setup>
defineProps({
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: ''
  },
  autodetect: {
    type: Boolean,
    default: true
  },
  ignoreIllegals: {
    type: Boolean,
    default: true
  }
})
</script>

<style lang="scss" scoped>
</style>
