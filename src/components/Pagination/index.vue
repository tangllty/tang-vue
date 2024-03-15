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
import { getProxy } from '@/utils/getCurrentInstance'

const proxy = getProxy()

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
    type: Array<number>,
    default: [10, 20, 30, 50, 100]
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

const currentPage = computed<number | undefined>({
  get: () => props.pageNum,
  set: val => proxy.$emit('update:pageNum', val)
})

const pageSize = computed<number | undefined>({
  get: () => props.pageSize,
  set: (val) => proxy.$emit('update:pageSize', val)
})

const handleSizeChange = (val: number): void => {
  proxy.$emit('pagination', { pageNum: currentPage, pageSize: val })
}

const handleCurrentChange = (val: number): void => {
  currentPage.value = val
  proxy.$emit('pagination', { pageNum: val, pageSize: pageSize })
}
</script>

<style lang="scss" scoped>
.pagination-container {
  padding: 12px;
}
</style>
