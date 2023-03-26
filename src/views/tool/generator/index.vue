<template>
  <div>
    <!-- 信息检索 -->
    <el-card style="margin-bottom: 10px;">
      <el-form
        ref="genTableQueryFormRef"
        :model="queryParams"
        inline
      >
        <el-form-item label="表名称" prop="tableName">
          <el-input
            v-model="queryParams.tableName"
            placeholder="请输入表名称"
            clearable
            @keyup.enter="handleList"
          />
        </el-form-item>
        <el-form-item label="表描述" prop="tableComment">
          <el-input
            v-model="queryParams.tableComment"
            placeholder="请输入表描述"
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

    <!-- 代码生成数据 -->
    <el-card>

      <!-- 代码生成操作 -->
      <template #header>
        <el-row class="mb-8">
          <el-button
            type="primary"
            :icon="Download"
            v-hasPermission="'tool:generator:list'"
            @click="handleDownloads"
          >下载</el-button>
          <el-button
            type="info"
            :icon="Upload"
            v-hasPermission="'tool:generator:import'"
            @click="handleImportTable"
          >导入</el-button>
          <el-button
            type="success"
            :icon="Edit"
            :disabled="genTableIds.length !== 1"
            v-hasPermission="'tool:generator:edit'"
            @click="handleEdit"
          >修改</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="genTableIds.length === 0"
            v-hasPermission="'tool:generator:delete'"
            @click="handleDeletes"
          >删除</el-button>
        </el-row>
      </template>

      <!-- 代码生成表格 -->
      <el-table
        v-loading="loading"
        :data="genTableList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="tableId"
          label="字典编号"
          align="center"
        />
        <el-table-column
          prop="tableName"
          label="表名称"
          show-overflow-tooltip
        />
        <el-table-column
          prop="tableComment"
          label="表描述"
          show-overflow-tooltip
        />
        <el-table-column
          prop="className"
          label="类名称"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160"
          align="center"
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="160"
          align="center"
        />
        <el-table-column
          label="操作"
          align="center"
          width="250"
        >
          <template #default="scope">
            <el-button
              type="primary"
              link
              :icon="View"
              size="small"
              v-hasPermission="'tool:generator:list'"
              @click="handlePreviewCode(scope.row)"
            >预览</el-button>
            <el-button
              type="primary"
              link
              :icon="Edit"
              size="small"
              v-hasPermission="'tool:generator:edit'"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              type="primary"
              link
              :icon="Delete"
              size="small"
              v-hasPermission="'tool:generator:delete'"
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-button
              type="primary"
              link
              :icon="Download"
              size="small"
              v-hasPermission="'tool:generator:list'"
              @click="handleDownload(scope.row)"
            >下载</el-button>
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

    <ImportTable ref="importTableRef" @submitted="handleList" />
    <PreviewCode ref="previewCodeRef" />
    <EditTable ref="editTableRef" @submitted="handleList" />
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue'
import { FormInstance } from 'element-plus'
import { Edit, Delete, Search, Refresh, Upload, View, Download } from '@element-plus/icons-vue'
import { listGenTable, deleteGenTable, deleteGenTables, downloadCode, downloadCodes } from '@/api/tool/generator'
import { GenTable, GenTableForm, GenTableQuery } from '@/api/tool/generator/types'
import { zip } from '@/utils/download'
import ImportTable from './importTable.vue'
import PreviewCode from './previewCode.vue'
import EditTable from './editTable.vue'

const { proxy }: any = getCurrentInstance()
const { sys_status } = proxy.$dict('sys_status')

const state = reactive({
  // 遮罩层
  loading: false,
  // 选中数据
  genTableId: 0 as number,
  // 选中数据数组
  genTableIds: [] as number[],
  // 选中表名数组
  tableNames: [] as string[],
  // 总条数
  total: 0,
  // 代码生成数据
  genTableList: [] as GenTable[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as GenTableQuery,
  // 表单
  genTableForm: {} as GenTableForm
})

const {
  loading,
  genTableIds,
  total,
  genTableList,
  queryParams
} = toRefs(state)

const importTableRef = ref<InstanceType<typeof ImportTable>>()
const previewCodeRef = ref<InstanceType<typeof PreviewCode>>()
const editTableRef = ref<InstanceType<typeof EditTable>>()
const genTableQueryFormRef = ref<FormInstance>()

// 查询代码生成列表
function handleList() {
  state.loading = true
  listGenTable(state.queryParams).then((res:any) => {
    state.genTableList = res.rows
    state.total = res.total
    state.loading = false
  })
}

// 导入代码生成信息
function handleImportTable() {
  importTableRef.value?.handleShow()
}

// 代码预览
function handlePreviewCode(row: any) {
  previewCodeRef.value?.handleShow(row.tableId)
}

// 修改代码生成信息
function handleEdit(row: any) {
  let genTableId = state.genTableId
  if (row.tableId) {
    genTableId = row.tableId
  }
  editTableRef.value?.handleShow(genTableId)
}

// 删除代码生成信息
function handleDelete(row: any) {
  proxy.$confirm('确认要删除"' + row.tableNames + '"代码生成信息吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deleteGenTable(row.tableId).then(() => {
      proxy.$message.success("删除代码生成信息成功")
      handleList()
    })
  })
}

// 批量删除代码生成信息
function handleDeletes() {
  proxy.$confirm('确认要删除"' + state.tableNames.toString() + '"代码生成信息吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deleteGenTables(state.genTableIds).then(() => {
      proxy.$message.success("删除代码生成信息成功")
      handleList()
    })
  })
}

// 代码下载
function handleDownload(row: any) {
  downloadCode(row.tableName).then((res) => {
    zip(res)
  })
}

// 批量代码下载
function handleDownloads() {
  const tableNames: string = state.tableNames.toString()
  downloadCodes({ tableNames }).then((res) => {
    zip(res)
  })
}

// 重置表单
function resetQuery() {
  genTableQueryFormRef.value?.resetFields()
  handleList()
}

// 多选框
function handleSelectionChange(selection: any) {
  state.genTableIds = selection.map((item: any) => item.tableId)
  state.tableNames = selection.map((item: any) => item.tableName)
  if (selection.length === 1) {
    state.genTableId = genTableIds.value[0]
  }
}

onMounted(() => {
  handleList()
})
</script>

<style lang="scss" scoped>
</style>