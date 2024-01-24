<template>
  <div>
    <!-- 信息检索 -->
    <el-card class="mb-10">
      <el-form
        ref="sysLogApiQueryFormRef"
        :model="queryParams"
        inline
      >
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
        :data="sysLogApiAnalysisList"
        row-key="apiId"
      >
        <el-table-column
          prop="className"
          label="类名称"
          show-overflow-tooltip
        />
        <el-table-column
          prop="methodName"
          label="方法名称"
          show-overflow-tooltip
        />
        <el-table-column
          prop="requestUri"
          label="请求URI"
          show-overflow-tooltip
        />
        <el-table-column
          prop="requestType"
          label="请求类型"
          align="center"
          width="100"
        />
        <el-table-column
          prop="count"
          label="请求次数"
          align="center"
          width="100"
        />
        <el-table-column
          prop="totalTime"
          label="总耗时"
          align="center"
        >
          <template #default="scope">
            {{ formatTime(scope.row.totalTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="averageTime"
          label="平均耗时"
          align="center"
          width="100"
        >
          <template #default="scope">
            {{ formatTime(scope.row.averageTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="minTime"
          label="最小耗时"
          align="center"
          width="100"
        >
          <template #default="scope">
            {{ formatTime(scope.row.minTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="maxTime"
          label="最大耗时"
          align="center"
          width="100"
        >
          <template #default="scope">
            {{ formatTime(scope.row.maxTime) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="190"
          align="center"
        >
          <template #default="scope">
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
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { FormInstance } from 'element-plus'
import { Delete, Search, Refresh } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { listSysLogApiAnalysis, deleteSysLogApi, deleteSysLogApis } from '@/api/system/log/api'
import { SysLogApiAnalysis, SysLogApiForm, SysLogApiQuery } from '@/api/system/log/api/types'

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
  sysLogApiAnalysisList: [] as SysLogApiAnalysis[],
  /** 查询参数 */
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as SysLogApiAnalysis,
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
  sysLogApiAnalysisList,
  queryParams,
  sysLogApiDialog,
  sysLogApiForm
} = toRefs(state)

const sysLogApiQueryFormRef = ref<FormInstance>()

/**
 * 查询接口日志列表
 */
const handleList = async () => {
  state.loading = true
  const res: any = await listSysLogApiAnalysis(state.queryParams)
  state.sysLogApiAnalysisList = res.rows
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
 * 重置表单
 */
const resetQuery = async () => {
  proxy.$resetForm(sysLogApiQueryFormRef.value)
  await handleList()
}

onMounted(async () => {
  await handleList()
})
</script>

<style lang="scss" scoped>
</style>
