<template>
  <!-- 部门树 -->
  <el-input
    v-model="deptName"
    placeholder="部门名称"
    clearable
    :prefix-icon="Search"
    class="mb-20"
  />
  <el-tree
    ref="deptTreeRef"
    :data="deptTree"
    :props="{ children: 'children', label: 'label' }"
    :expand-on-click-node="false"
    :current-node-key="currentNodeKey"
    :filter-node-method="filterNode"
    default-expand-all
    @node-click="handleDeptNodeClick"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { ElInput, ElTree } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'
import { getProxy } from '@/utils/getCurrentInstance'
import { listDeptTree } from '@/api/system/dept'

const proxy = getProxy()

const props = defineProps({
  deptId: {
    type: Number,
    default: null
  }
})

const state = reactive({
  // 部门名称
  deptName: undefined,
  // 部门树数据
  deptTree: [] as TreeSelect[],
})

const {
  deptName,
  deptTree
} = toRefs(state)

const deptTreeRef = ref<InstanceType<typeof ElTree>>()

// 筛选部门树信息
watch(deptName, (val) => {
  deptTreeRef.value!.filter(val)
})

const filterNode = (value: string, data: TreeNodeData) => {
  if (!value) return true
  return data.label.includes(value)
}

// 查询部门树
const getDeptTree = async () => {
  const res: any = await listDeptTree()
  state.deptTree = res.data
}

const currentNodeKey = computed<number>({
  get: () => props.deptId,
  set: val => proxy.$emit('update:deptId', val)
})

// 部门树节点
const handleDeptNodeClick = async (data: any) => {
  currentNodeKey.value = data.value
  proxy.$emit('nodeClick', { deptId: data.value })
}

onMounted(async () => {
  await getDeptTree()
})
</script>

<style lang="scss" scoped>
</style>
