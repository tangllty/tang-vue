<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts" setup>
const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String,
    required: false
  },
  color: {
    type: String
  },
  size: {
    type: String,
    default: '1em'
  }
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style lang="scss" scoped>
.svg-icon {
  width: v-bind(size);
  height: v-bind(size);
  overflow: hidden;
  fill: currentColor;
}
</style>
