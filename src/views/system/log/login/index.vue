<template>
  <div>
    <!-- 信息检索 -->
    <el-card style="margin-bottom: 10px;">
      <el-form
        ref="sysLogLoginQueryFormRef"
        :model="queryParams"
        inline
      >
        <el-form-item label="登陆账号" prop="account">
          <el-input
            v-model="queryParams.account"
            placeholder="请输入登陆账号"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="是否成功" prop="success">
          <el-select
            v-model="queryParams.success"
            placeholder="请选择是否成功"
            @change="handleList"
            clearable
          >
            <el-option label="成功" value="成功" />
            <el-option label="失败" value="失败" />
          </el-select>
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

    <!-- 登陆日志数据 -->
    <el-card>

      <!-- 登陆日志操作 -->
      <template #header>
        <el-row class="mb-8">
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="loginIds.length === 0"
            v-hasPermission="'system:log:login:delete'"
            @click="handleDeletes"
          >删除</el-button>
        </el-row>
      </template>

      <!-- 登陆日志表格 -->
      <el-table
        v-loading="loading"
        :data="sysLogLoginList"
        row-key="loginId"
        lazy
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="loginId"
          label="日志ID"
          align="center"
        />
        <el-table-column
          prop="userId"
          label="用户ID"
          align="center"
        />
        <el-table-column
          prop="account"
          label="登陆账号"
          align="center"
        />
        <el-table-column
          prop="loginType"
          label="登陆类型"
          align="center"
        />
        <el-table-column
          prop="os"
          label="操作系统"
          align="center"
        />
        <el-table-column
          prop="browser"
          label="浏览器"
          align="center"
        />
        <el-table-column
          prop="ip"
          label="IP地址"
          align="center"
        />
        <el-table-column
          prop="location"
          label="登录地点"
          align="center"
        />
        <el-table-column
          prop="loginTime"
          label="登录时间"
          align="center"
          width="160"
        />
        <el-table-column
          prop="success"
          label="是否成功"
          align="center"
        >
          <template #default="scope">
            <el-tag :type="scope.row.success === '成功' ? 'success' : 'danger'">{{ scope.row.success }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="message"
          label="返回消息"
          align="center"
        />
        <el-table-column
          label="操作"
          width="90"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="primary"
              link
              :icon="Delete"
              size="small"
              v-hasPermission="'system:log:login:delete'"
              @click="handleDelete(scope.row)"
            >删除</el-button>
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
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue'
import { FormInstance } from 'element-plus'
import { Delete, Search, Refresh } from '@element-plus/icons-vue'
import { listSysLogLogin, deleteSysLogLogin, deleteSysLogLogins } from '@/api/system/log/login'
import { SysLogLogin, SysLogLoginQuery } from '@/api/system/log/login/types'

const { proxy }: any = getCurrentInstance()

const state = reactive({
  // 遮罩层
  loading: false,
  // 选中数据
  loginId: 0 as number,
  // 选中数据数组
  loginIds: [] as number[],
  // 总条数
  total: 0,
  // 登陆日志数据
  sysLogLoginList: [] as SysLogLogin[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as SysLogLoginQuery
})

const {
  loading,
  loginIds,
  total,
  sysLogLoginList,
  queryParams
} = toRefs(state)

const sysLogLoginQueryFormRef = ref<FormInstance>()

// 查询登陆日志列表
function handleList() {
  state.loading = true
  listSysLogLogin(state.queryParams).then((res:any) => {
    state.sysLogLoginList = res.rows
    state.total = res.total
    state.loading = false
  })
}

// 删除登陆日志信息
function handleDelete(row: any) {
  proxy.$confirm('确认删除"' + row.loginId + '"登陆日志信息吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deleteSysLogLogin(row.loginId).then(() => {
      proxy.$message.success("删除${classComment}信息成功")
      handleList()
    })
  })
}

// 批量删除登陆日志信息
function handleDeletes() {
  proxy.$confirm('确认删除"' + state.loginIds + '"登陆日志信息吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deleteSysLogLogins(state.loginIds).then(() => {
      proxy.$message.success("删除${classComment}信息成功")
      handleList()
    })
  })
}

// 重置表单
function resetQuery() {
  sysLogLoginQueryFormRef.value?.resetFields()
  handleList()
}

// 多选框
function handleSelectionChange(selection: any) {
  state.loginIds = selection.map((item: any) => item.loginId)
  if (selection.length === 1) {
    state.loginId = loginIds.value[0]
  }
}

onMounted(() => {
  handleList()
})
</script>

<style lang="scss" scoped>
</style>