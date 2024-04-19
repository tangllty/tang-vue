<template>
  <MonacoEditor v-model="js" :language="'javascript'" />
  <MonacoEditor v-model="html" :language="'html'" />
</template>

<script lang="ts" setup>
const js = ref<string>(['const example = () => {', '\tconsole.log("Hello world!");', '}', ''].join('\n'))
const html = ref<string>(['<div>', '\t<h1>Hello world!</h1>', '</div>'].join('\n'))
</script>

<style lang="scss" scoped>
</style>
