<template>
  <el-image
    :src="src"
    fit="cover"
    :preview-src-list="[src]"
  >
    <template #error>
      <div class="image-slot">
        <el-icon><Picture /></el-icon>
      </div>
    </template>
  </el-image>
</template>

<script lang="ts" setup>
import { Picture } from '@element-plus/icons-vue'

defineProps({
  src: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '50px'
  },
  borderRadius: {
    type: String,
    default: '5px'
  },
  transition: {
    type: String,
    default: '0.3s'
  },
  scale: {
    type: Number,
    default: 1.1
  }
})
</script>

<style lang="scss" scoped>
.el-image {
  width: v-bind(size);
  height: v-bind(size);
  border-radius: v-bind(borderRadius);
  box-shadow: 0 0 4px #bbb;

  :deep(.el-image__inner) {
    cursor: pointer;
    transition: transform v-bind(transition);

    &:hover {
      transform: scale(v-bind(scale));
    }
  }

  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 1.5em;
  }
}
</style>
