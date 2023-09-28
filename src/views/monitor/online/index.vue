<template>
  <div>
    <!-- 信息检索 -->
    <el-card class="mb-10">
      <el-form ref="onlineUserQueryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="queryParams.username"
            placeholder="用户名称"
            clearable
            @keyup.enter="handleList"
          />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input
            v-model="queryParams.nickname"
            placeholder="用户昵称"
            clearable
            @keyup.enter="handleList"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :icon="Search"
            @click="handleList"
          >搜索</el-button>
          <el-button
            :icon="Refresh"
            @click="resetQuery"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 在线用户数据 -->
    <el-card>

      <!-- 在线用户表格 -->
      <el-table
        v-loading="loading"
        :data="onlineUserList"
        row-key="onlineUserId"
        lazy
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          prop="token"
          label="会话编号"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="username"
          label="用户名称"
          align="center"
        />
        <el-table-column
          prop="nickname"
          label="用户昵称"
          align="center"
        />
        <el-table-column
          prop="deptName"
          label="所在部门"
          align="center"
        />
        <el-table-column
          prop="ip"
          label="IP地址"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="location"
          label="登陆地址"
          align="center"
        />
        <el-table-column
          prop="browser"
          label="浏览器"
          align="center"
        />
        <el-table-column
          prop="os"
          label="系统"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="loginTime"
          label="登陆时间"
          width="160"
          align="center"
        />
        <el-table-column
          label="操作"
          width="190"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="primary"
              link
              :icon="View"
              size="small"
              v-hasPermission="'monitor:online:list'"
              @click="getInfo(scope.row)"
            >详情</el-button>
            <el-button
              type="primary"
              link
              :icon="Delete"
              size="small"
              v-hasPermission="'monitor:online:delete'"
              @click="handleDelete(scope.row)"
            >强退</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination
        v-if="total > 0"
        :total="total"
        v-model:pageNum="queryParams.pageNum"
        v-model:pageSize="queryParams.pageSize"
        @pagination="handleList"
      />
    </el-card>

    <!-- 添加或修改角色信息对话框 -->
    <el-dialog
      :title="onlineUserDialog.title"
      v-model="onlineUserDialog.visible"
      @close="closeOnlineUserDialog"
    >
      <div>
        <el-row :gutter="20">
          <el-col :span="12">会话编号: {{ onlineUserInfo.token }}</el-col>
          <el-col :span="12">部门名称: {{ onlineUserInfo.deptName }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">用户账号: {{ onlineUserInfo.username }}</el-col>
          <el-col :span="12">昵称: {{ onlineUserInfo.nickname }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">邮箱: {{ onlineUserInfo.email }}</el-col>
          <el-col :span="12">手机号码: {{ onlineUserInfo.phone }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">性别: {{ onlineUserInfo.gender }}</el-col>
          <el-col :span="12">是否为移动平台: {{ onlineUserInfo.mobile }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">IP地址: {{ onlineUserInfo.ip }}</el-col>
          <el-col :span="12">地址: {{ onlineUserInfo.location }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">浏览器类型: {{ onlineUserInfo.browser }}</el-col>
          <el-col :span="12">浏览器版本: {{ onlineUserInfo.version }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">平台类型: {{ onlineUserInfo.platform }}</el-col>
          <el-col :span="12">登陆方式: {{ onlineUserInfo.loginType }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">系统类型: {{ onlineUserInfo.os }}</el-col>
          <el-col :span="12">系统版本: {{ onlineUserInfo.osVersion }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">引擎类型: {{ onlineUserInfo.engine }}</el-col>
          <el-col :span="12">引擎版本: {{ onlineUserInfo.engineVersion }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">登陆时间: {{ onlineUserInfo.loginTime }}</el-col>
          <el-col :span="12">过期时间: {{ onlineUserInfo.expireTime }}</el-col>
        </el-row>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="closeOnlineUserDialog"
          >关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { FormInstance } from 'element-plus'
import { Delete, Search, Refresh, View } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { listOnlineUser, getOnlineUser, deleteOnlineUser } from '@/api/monitor/online'
import { OnlineUser, OnlineUserQuery } from '@/api/monitor/online/types'

const proxy = getProxy()

const state = reactive({
  // 遮罩层
  loading: false,
  // 总条数
  total: 0,
  // 在线用户详情
  onlineUserInfo: {} as OnlineUser,
  // 在线用户数据
  onlineUserList: [] as OnlineUser[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as OnlineUserQuery,
  // 对话框
  onlineUserDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog
})

const {
  loading,
  total,
  onlineUserInfo,
  onlineUserList,
  queryParams,
  onlineUserDialog
} = toRefs(state)

const onlineUserQueryFormRef = ref<FormInstance>()

// 查询在线用户列表
const handleList = async () => {
  state.loading = true
  const res: any = await listOnlineUser(state.queryParams)
  state.onlineUserList = res.rows
  state.total = res.total
  state.loading = false
}

// 查询在线用户
const getInfo = async (row: any) => {
  const res: any = await getOnlineUser(row.token)
  state.onlineUserInfo = res.data

  state.onlineUserDialog.title = '在线用户信息'
  state.onlineUserDialog.visible = true
}

// 删除在线用户信息
const handleDelete = async (row: any) => {
  try {
    await proxy.$confirm('确认要强退"' + row.username + '"用户吗?', '警告', {
      type: 'warning'
    })
    await deleteOnlineUser(row.token)
    proxy.$message.success('强退' + row.username + '成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

// 重置表单
const resetQuery = async () => {
  onlineUserQueryFormRef.value?.resetFields()
  await handleList()
}

// 关闭对话框
const closeOnlineUserDialog = () => {
  state.onlineUserDialog.visible = false
}

onMounted(async () => {
  await handleList()
})
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
