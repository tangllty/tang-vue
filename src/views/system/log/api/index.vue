<template>
  <div>
    <!-- 信息检索 -->
    <el-card class="mb-10">
      <el-form
        ref="sysLogApiQueryFormRef"
        :model="queryParams"
        inline
      >
        <el-form-item label="日志ID" prop="apiId">
          <el-input
            v-model="queryParams.apiId"
            placeholder="请输入日志ID"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="queryParams.userId"
            placeholder="请输入用户ID"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="类名称" prop="className">
          <el-input
            v-model="queryParams.className"
            placeholder="请输入类名称"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="方法名称" prop="methodName">
          <el-input
            v-model="queryParams.methodName"
            placeholder="请输入方法名称"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="请求URI" prop="requestUri">
          <el-input
            v-model="queryParams.requestUri"
            placeholder="请输入请求URI"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="请求类型" prop="requestType">
          <el-input
            v-model="queryParams.requestType"
            placeholder="请输入请求类型"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="登陆类型" prop="loginType">
          <el-input
            v-model="queryParams.loginType"
            placeholder="请输入登陆类型"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="登录IP地址" prop="ip">
          <el-input
            v-model="queryParams.ip"
            placeholder="请输入登录IP地址"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="登录地点" prop="location">
          <el-input
            v-model="queryParams.location"
            placeholder="请输入登录地点"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态码" prop="statusCode">
          <el-input
            v-model="queryParams.statusCode"
            placeholder="请输入状态码"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="消息" prop="message">
          <el-input
            v-model="queryParams.message"
            placeholder="请输入消息"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="创建者" prop="createBy">
          <el-input
            v-model="queryParams.createBy"
            placeholder="请输入创建者"
            @keyup.enter="handleList"
            clearable
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

    <!-- 接口日志数据 -->
    <el-card>

      <!-- 接口日志操作 -->
      <template #header>
        <el-row>
          <el-button
            type="primary"
            :icon="Plus"
            v-hasPermission="'system:log:api:add'"
            @click="handleAdd"
            v-if="false"
          >新增</el-button>
          <el-button
            type="success"
            :icon="Edit"
            :disabled="apiIds.length !== 1"
            v-hasPermission="'system:dict:edit'"
            @click="handleEdit"
            v-if="false"
          >修改</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="apiIds.length === 0"
            v-hasPermission="'system:log:api:delete'"
            @click="handleDeletes"
          >删除</el-button>
        </el-row>
      </template>

      <!-- 接口日志表格 -->
      <el-table
        v-loading="loading"
        :data="sysLogApiList"
        row-key="apiId"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="apiId"
          label="日志ID"
          align="center"
        />
        <el-table-column
          prop="userId"
          label="用户ID"
          align="center"
        />
        <el-table-column
          prop="className"
          label="类名称"
          align="center"
          width="160"
          show-overflow-tooltip
        />
        <el-table-column
          prop="methodName"
          label="方法名称"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="requestUri"
          label="请求URI"
          width="180"
          show-overflow-tooltip
        />
        <el-table-column
          prop="requestType"
          label="请求类型"
          align="center"
          width="100"
        />
        <el-table-column
          prop="requestParam"
          label="请求体"
          align="center"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="responseBody"
          label="响应体"
          align="center"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="loginType"
          label="登陆类型"
          align="center"
          width="100"
        />
        <el-table-column
          prop="ip"
          label="登录IP地址"
          align="center"
          width="130"
        />
        <el-table-column
          prop="location"
          label="登录地点"
          align="center"
          width="100"
        />
        <el-table-column
          prop="startTime"
          label="开始时间"
          align="center"
          width="180"
        />
        <el-table-column
          prop="endTime"
          label="结束时间"
          align="center"
          width="180"
        />
        <el-table-column
          prop="costTime"
          label="耗时"
          align="center"
        >
          <template #default="scope">
            {{ formatTime(scope.row.costTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="statusCode"
          label="状态码"
          align="center"
        />
        <el-table-column
          prop="message"
          label="消息"
          align="center"
        />
        <el-table-column
          prop="createBy"
          label="创建者"
          align="center"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="180"
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
              :icon="Edit"
              size="small"
              v-hasPermission="'system:log:api:edit'"
              @click="handleEdit(scope.row)"
              v-if="false"
            >修改</el-button>
            <el-button
              type="primary"
              link
              :icon="Delete"
              size="small"
              v-hasPermission="'system:log:api:delete'"
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

    <!-- 添加或修改接口日志信息对话框 -->
    <el-dialog
      :title="sysLogApiDialog.title"
      v-model="sysLogApiDialog.visible"
      @close="closeSysLogApiDialog"
    >
      <el-form
        ref="sysLogApiRuleFormRef"
        :model="sysLogApiForm"
        :rules="sysLogApiRules"
        label-width="120px"
        status-icon
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="sysLogApiForm.userId"
            placeholder="请输入用户ID"
          />
        </el-form-item>
        <el-form-item label="类名称" prop="className">
          <el-input
            v-model="sysLogApiForm.className"
            placeholder="请输入类名称"
          />
        </el-form-item>
        <el-form-item label="方法名称" prop="methodName">
          <el-input
            v-model="sysLogApiForm.methodName"
            placeholder="请输入方法名称"
          />
        </el-form-item>
        <el-form-item label="请求URI" prop="requestUri">
          <el-input
            v-model="sysLogApiForm.requestUri"
            placeholder="请输入请求URI"
          />
        </el-form-item>
        <el-form-item label="请求类型" prop="requestType">
          <el-input
            v-model="sysLogApiForm.requestType"
            placeholder="请输入请求类型"
          />
        </el-form-item>
        <el-form-item label="请求体" prop="requestParam">
          <el-input
            v-model="sysLogApiForm.requestParam"
            placeholder="请输入请求体"
          />
        </el-form-item>
        <el-form-item label="响应体" prop="responseBody">
          <el-input
            v-model="sysLogApiForm.responseBody"
            placeholder="请输入响应体"
          />
        </el-form-item>
        <el-form-item label="登陆类型" prop="loginType">
          <el-input
            v-model="sysLogApiForm.loginType"
            placeholder="请输入登陆类型"
          />
        </el-form-item>
        <el-form-item label="登录IP地址" prop="ip">
          <el-input
            v-model="sysLogApiForm.ip"
            placeholder="请输入登录IP地址"
          />
        </el-form-item>
        <el-form-item label="登录地点" prop="location">
          <el-input
            v-model="sysLogApiForm.location"
            placeholder="请输入登录地点"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="sysLogApiForm.startTime"
            type="datetime"
            placeholder="选择开始时间日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="sysLogApiForm.endTime"
            type="datetime"
            placeholder="选择结束时间日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="耗时" prop="costTime">
          <el-date-picker
            v-model="sysLogApiForm.costTime"
            type="datetime"
            placeholder="选择耗时日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="状态码" prop="statusCode">
          <el-input
            v-model="sysLogApiForm.statusCode"
            placeholder="请输入状态码"
          />
        </el-form-item>
        <el-form-item label="消息" prop="message">
          <el-input
            v-model="sysLogApiForm.message"
            placeholder="请输入消息"
          />
        </el-form-item>
        <el-form-item label="创建者" prop="createBy">
          <el-input
            v-model="sysLogApiForm.createBy"
            placeholder="请输入创建者"
          />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="sysLogApiForm.createTime"
            type="datetime"
            placeholder="选择创建时间日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="更新者" prop="updateBy">
          <el-date-picker
            v-model="sysLogApiForm.updateBy"
            type="date"
            placeholder="选择更新者日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="更新时间" prop="updateTime">
          <el-date-picker
            v-model="sysLogApiForm.updateTime"
            type="datetime"
            placeholder="选择更新时间日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="sysLogApiForm.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitForm(sysLogApiRuleFormRef)"
          >确 定</el-button>
          <el-button
            @click="closeSysLogApiDialog"
          >取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { listSysLogApi, getSysLogApi, addSysLogApi, editSysLogApi, deleteSysLogApi, deleteSysLogApis } from '@/api/system/log/api'
import { SysLogApi, SysLogApiForm, SysLogApiQuery } from '@/api/system/log/api/types'

const proxy = getProxy()

const state = reactive({
  /** 遮罩层 */
  loading: false as boolean,
  /** 选中数据 */
  apiId: 0 as number,
  /** 选中数据数组 */
  apiIds: [] as number[],
  /** 总条数 */
  total: 0 as number,
  /** 接口日志数据 */
  sysLogApiList: [] as SysLogApi[],
  /** 查询参数 */
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as SysLogApiQuery,
  /** 接口日志对话框 */
  sysLogApiDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  /** 接口日志表单 */
  sysLogApiForm: {} as SysLogApiForm
})

const {
  loading,
  apiIds,
  total,
  sysLogApiList,
  queryParams,
  sysLogApiDialog,
  sysLogApiForm
} = toRefs(state)

const sysLogApiRuleFormRef = ref<FormInstance>()
const sysLogApiQueryFormRef = ref<FormInstance>()
const sysLogApiRules = reactive<FormRules>({
  userId: [
    { required: true, message: '用户ID不能为空', trigger: 'blur' },
  ],
  className: [
    { required: true, message: '类名称不能为空', trigger: 'blur' },
  ],
  methodName: [
    { required: true, message: '方法名称不能为空', trigger: 'blur' },
  ],
  requestUri: [
    { required: true, message: '请求URI不能为空', trigger: 'blur' },
  ],
  requestType: [
    { required: true, message: '请求类型不能为空', trigger: 'blur' },
  ],
  requestParam: [
    { required: true, message: '请求体不能为空', trigger: 'blur' },
  ],
  responseBody: [
    { required: true, message: '响应体不能为空', trigger: 'blur' },
  ],
  loginType: [
    { required: true, message: '登陆类型不能为空', trigger: 'blur' },
  ],
  ip: [
    { required: true, message: '登录IP地址不能为空', trigger: 'blur' },
  ],
  location: [
    { required: true, message: '登录地点不能为空', trigger: 'blur' },
  ],
  startTime: [
    { required: true, message: '开始时间不能为空', trigger: 'blur' },
  ],
  endTime: [
    { required: true, message: '结束时间不能为空', trigger: 'blur' },
  ],
  costTime: [
    { required: true, message: '耗时不能为空', trigger: 'blur' },
  ],
  statusCode: [
    { required: true, message: '状态码不能为空', trigger: 'blur' },
  ],
  message: [
    { required: true, message: '消息不能为空', trigger: 'blur' },
  ],
  createBy: [
    { required: true, message: '创建者不能为空', trigger: 'blur' },
  ],
  createTime: [
    { required: true, message: '创建时间不能为空', trigger: 'blur' },
  ],
  updateBy: [
    { required: true, message: '更新者不能为空', trigger: 'blur' },
  ],
  updateTime: [
    { required: true, message: '更新时间不能为空', trigger: 'blur' },
  ],
  remark: [
    { required: true, message: '备注不能为空', trigger: 'blur' },
  ],
})

/**
 * 查询接口日志列表
 */
const handleList = async () => {
  state.loading = true
  const res: any = await listSysLogApi(state.queryParams)
  state.sysLogApiList = res.rows
  state.total = res.total
  state.loading = false
}

/**
 * 格式化时间
 */
const formatTime = (timestamp: number): string => {
  if (timestamp <= 0) {
    return '0ms'
  }

  const unitValueMap = {
    'y': 52 * 7 * 24 * 60 * 60 * 1000,
    'w': 7 * 24 * 60 * 60 * 1000,
    'd': 24 * 60 * 60 * 1000,
    'h': 60 * 60 * 1000,
    'm': 60 * 1000,
    's': 1000,
    'ms': 1
  }
  let result = ''
  let remainingTime = timestamp
  for (const [timeUnit, unitValue] of Object.entries(unitValueMap)) {
    if (remainingTime >= unitValue) {
      const unitCount = Math.floor(remainingTime / unitValue)
      result += unitCount + timeUnit
      remainingTime %= unitValue
    }
  }
  return result
}

/**
 * 添加接口日志信息
 */
const handleAdd = () => {
  state.sysLogApiDialog = {
    title: '新增接口日志信息',
    type: 'add',
    visible: true
  }
}

/**
 * 修改接口日志信息
 *
 * @param row 接口日志信息
 */
const handleEdit = async (row: SysLogApi) => {
  let apiId = state.apiId
  if (row.apiId) {
    apiId = row.apiId
  }
  const res: any = await getSysLogApi(apiId)
  state.sysLogApiForm = res.data

  state.sysLogApiDialog = {
    title: '修改接口日志信息',
    type: 'edit',
    visible: true
  }
}

/**
 * 删除接口日志信息
 *
 * @param row 接口日志信息
 */
const handleDelete = async (row: SysLogApi) => {
  try {
    await proxy.$confirm('确认删除"' + row.apiId + '"接口日志信息吗？', '提示', {
      type: 'warning'
    })
    await deleteSysLogApi(row.apiId)
    proxy.$message.success('删除接口日志信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

/**
 * 批量删除接口日志信息
 */
const handleDeletes = async () => {
  try {
    await proxy.$confirm('确认删除"' + state.apiIds + '"接口日志信息吗？', '提示', {
      type: 'warning'
    })
    await deleteSysLogApis(state.apiIds)
    proxy.$message.success('删除接口日志信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

/**
 * 重置表单
 */
const resetQuery = async () => {
  proxy.$resetForm(sysLogApiQueryFormRef.value)
  await handleList()
}

/**
 * 关闭接口日志对话框
 */
const closeSysLogApiDialog = () => {
  state.sysLogApiDialog.visible = false
  proxy.$resetForm(sysLogApiRuleFormRef.value)
  state.sysLogApiForm = {} as SysLogApiForm
}

/**
 * 选中数据
 *
 * @param selection 选中数据
 */
const handleSelectionChange = (selection: SysLogApi[]) => {
  state.apiIds = selection.map((item: SysLogApi) => item.apiId)
  if (selection.length === 1) {
    state.apiId = apiIds.value[0]
  }
}

/**
 * 提交表单
 *
 * @param formEl 表单实例
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    if (sysLogApiDialog.value.type == 'add') {
      await addSysLogApi(state.sysLogApiForm)
      proxy.$message.success('添加接口日志信息成功')
      closeSysLogApiDialog()
      await handleList()
    }
    if (sysLogApiDialog.value.type == 'edit') {
      await editSysLogApi(state.sysLogApiForm)
      proxy.$message.success('修改接口日志信息成功')
      closeSysLogApiDialog()
      await handleList()
    }
  } catch (error) {
    console.log('error submit!', error)
  }
}

onMounted(async () => {
  await handleList()
})
</script>

<style lang="scss" scoped>
</style>
