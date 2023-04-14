<template>
  <div class="pagination-container">
    <el-pagination
      :background="background"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  background: {
    type: Boolean,
    default: true
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  pageSizes: {
    type: Array<Number>,
    default: [10, 20, 30, 50]
  },
  total: {
    type: Number,
    default: 0
  },
  pageNum: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:pageNum', 'update:pageSize', 'pagination'])

const currentPage = computed<number | undefined>({
  get: () => props.pageNum,
  set: val => emit('update:pageNum', val)
})

const pageSize = computed<number | undefined>({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val)
})

const handleSizeChange = (val: number) => {
  emit('pagination', { pageNum: currentPage, pageSize: val })
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  emit('pagination', { pageNum: val, pageSize: props.pageSize })
}
</script>

<style lang="scss" scoped>
.pagination-container {
  padding: 12px;
}
</style>
