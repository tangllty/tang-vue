<template>
  <div class="search-bar">
    <el-button
      :icon="Operation"
      circle
      @click="proxy.$notImplemented"
    />
    <el-input
      v-model="keyword"
      :prefix-icon="Search"
      placeholder="请输入搜索内容"
      clearable
      @focus="proxy.$notImplemented"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { Operation, Search } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'

const proxy = getProxy()

const state = reactive({
  keyword: ''
})

const {
  keyword
} = toRefs(state)
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  height: 50px;

  .el-button {
    margin-right: 10px;
  }

  .el-input {
    width: 100%;
    border-radius: 5%;
  }
}
</style>
