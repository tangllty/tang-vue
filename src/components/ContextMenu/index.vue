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
import { onMounted, ref, nextTick } from 'vue'
import { ContextMenuOptions } from './types'
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
  background-color: #f9f9fb;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  min-width: 120px;
  padding-left: 0;
  border-radius: 5px;
  border: 1px solid  #c5c5c5;

  &:focus {
    outline: none;
  }
}
</style>
