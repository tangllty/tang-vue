<template>
  <div>
    <!-- 搜索用户好友对话库 -->
    <el-dialog
      :title="searchUserDialog.title"
      v-model="searchUserDialog.visible"
      @close="closeSearchUserDialog"
    >
      <!-- 用户好友搜索框 -->
      <el-input
        v-model="queryParams.keyword"
        placeholder="请输入关键词搜索"
        @keyup.enter.native="handleSearchFriend"
        clearable
      />
      <el-table
        v-loading="loading"
        :data="searchUserList"
        row-key="userId"
      >
        <el-table-column
          prop="username"
          label="用户名"
          align="center"
        />
        <el-table-column
          label="昵称"
          prop="nickname"
          align="center"
        />
        <el-table-column
          label="邮箱"
          prop="email"
          align="center"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column
          label="手机号码"
          prop="phone"
          align="center"
          width="120"
        />
        <el-table-column
          label="性别"
          prop="gender"
          align="center"
        >
          <template #default="scope">
            <dict-tag :data="sys_user_gender" :value="scope.row.gender" />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="130"
        >
          <template #default="scope">
            <el-button
              type="primary"
              link
              size="small"
              :icon="Edit"
              v-hasPermission="'system:user:edit'"
              @click="handleRequest(scope.row)"
            >发送申请</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <SendRequest ref="sendRequestRef" @submitted="handleSearchFriend(true)" />
  </div>
</template>

<script lang="ts" setup>
import { Edit } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { listUserFuzzy } from '@/api/app/chat/friend-apply'
import type { SysUser, SysUserFuzzyQuery } from '@/api/system/user/types'
import type { SendRequestInstance } from './instance'
import SendRequest from './SendRequest.vue'

const proxy = getProxy()
const { sys_user_gender } = proxy.$dict('sys_user_gender')

const state = reactive({
  // 遮罩层
  loading: false,
  // 总条数
  total: 0,
  // 模糊查询用户数据
  searchUserList: [] as SysUser[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as SysUserFuzzyQuery,
  // 搜索用户好友对话库
  searchUserDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
})

const {
  loading,
  total,
  searchUserList,
  queryParams,
  searchUserDialog,
} = toRefs(state)

const sendRequestRef = ref<SendRequestInstance>()

// 搜索用户好友
const handleSearch = () => {
  state.searchUserDialog = {
    title: '搜索用户好友',
    type: 'search',
    visible: true
  }
}

// 刷新用户好友申请列表
const handleSearchFriend = async (refresh: boolean) => {
  const res: any = await listUserFuzzy(state.queryParams)
  state.searchUserList = res.rows

  if (refresh) {
    proxy.$emit('submitted')
  }
}

// 打开发送用户好友申请对话框
const handleRequest = (row: SysUser) => {
  sendRequestRef.value?.handleRequest(row)
}

// 关闭对话框
const closeSearchUserDialog = () => {
  state.searchUserDialog.visible = false
}

defineExpose({
  handleSearch
})
</script>

<style lang="scss" scoped>
</style>
