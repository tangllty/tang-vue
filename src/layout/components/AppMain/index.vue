<template>
  <RouterView v-slot="{ Component }">
    <Transition name="slide-fade" mode="out-in">
      <Component :is="Component" />
    </Transition>
  </RouterView>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
</style>
