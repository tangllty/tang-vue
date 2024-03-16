<template>
  <ul
    class="context-menu"
    ref="contextMenuRef"
    @blur.native.capture="handleBlur"
    tabindex="-1"
  >
    <MenuItem
      v-for="item in options.items"
      :item="item"
      :key="item.label"
      :on-close="props.onClose"
    />
  </ul>
</template>

<script lang="ts" setup>
import type { ContextMenuOptions } from './types'
import MenuItem from './MenuItem.vue'

const props = defineProps({
  options: {
    type: Object as () => ContextMenuOptions,
    default: null
  },
  onClose: {
    type: Function,
    default: () => {}
  }
})

const contextMenuRef = ref<HTMLDivElement>()

const handleBlur = () => {
  props.onClose()
}

onMounted(async () => {
  await nextTick()
  const contextMenu = contextMenuRef.value as HTMLDivElement
  contextMenu.focus()
})
</script>

<style lang="scss" scoped>
.context-menu {
  position: fixed;
  background-color: var(--context-menu-background);
  box-shadow: 0 0 5px var(--context-menu-box-shadow);
  min-width: 120px;
  padding-left: 0;
  border-radius: 5px;
  border: 1px solid  var(--context-menu-border);

  &:focus {
    outline: none;
  }
}
</style>
