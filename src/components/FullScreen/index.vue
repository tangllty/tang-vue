<template>
  <el-button @click="toggleDialog" size="small">全屏</el-button>
  <el-dialog
    v-model="dialog.visible"
    :title="title"
    :close-on-click-modal="false"
    fullscreen
    overflow
  >
    <slot></slot>
  </el-dialog>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Title'
  }
})

const state = reactive({
  dialog: {
    title: props.title,
    visible: false
  } as Dialog
})

const {
  dialog
} = toRefs(state)

const toggleDialog = () => {
  dialog.value.visible = !dialog.value.visible
}
</script>

<style lang="scss" scoped>
</style>
