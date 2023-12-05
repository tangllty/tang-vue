<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/index' }">
      首页
    </el-breadcrumb-item>
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbs"
      :key="index"
      :to="{ path: item.path }"
    >{{ item.meta.title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, watch } from 'vue'
import { useRoute, RouteLocationMatched } from 'vue-router'

const currentRoute = useRoute()

const breadcrumbs = ref([] as Array<RouteLocationMatched>)

/**
 * 过滤面包屑
 */
const filterBreadcrumbs = () => {
  if (currentRoute.path === '/index') {
    breadcrumbs.value = []
  }
  // 过滤没有设置 title 的路由
  breadcrumbs.value = breadcrumbs.value.filter((item: any) => item.meta.title)
}

watch(currentRoute, () => {
  breadcrumbs.value = currentRoute.matched
  filterBreadcrumbs()
})

onBeforeMount(() => {
  breadcrumbs.value = currentRoute.matched
  filterBreadcrumbs()
})
</script>

<style lang="scss" scoped>
</style>
