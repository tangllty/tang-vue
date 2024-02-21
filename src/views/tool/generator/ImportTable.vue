<template>
  <!-- 导入代码生成信息对话框 -->
  <el-dialog
    :title="importTableDialog.title"
    v-model="importTableDialog.visible"
    width="65%"
    @close="closeImportTableDialog"
    append-to-body
  >
    <el-form
      ref="genTableRuleFormRef"
      :model="importTableForm"
      inline
    >
      <el-form-item label="表名称" prop="tableName">
        <el-input
          v-model="queryParams.tableName"
          placeholder="表名称"
          @keyup.enter="handleList"
        />
      </el-form-item>
      <el-form-item label="表描述" prop="tableComment">
        <el-input
          v-model="queryParams.tableComment"
          placeholder="表描述"
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

    <el-table
      v-loading="loading"
      :data="importTableList"
      row-key="genTableId"
      lazy
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        prop="tableName"
        label="表名称"
        align="center"
      />
      <el-table-column
        prop="tableComment"
        label="表描述"
        align="center"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
        align="center"
      />
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="180"
        align="center"
      />
    </el-table>

    <!-- 分页 -->
    <pagination
      v-if="total > 0"
      :total="total"
      v-model:pageNum="queryParams.pageNum"
      v-model:pageSize="queryParams.pageSize"
      @pagination="handleList"
    />

    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm(genTableRuleFormRef)"
        >确 定</el-button>
        <el-button
          @click="closeImportTableDialog"
        >取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { FormInstance } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { listDatabaseTable, importTable } from '@/api/tool/generator'
import { GenTable, GenTableForm, GenTableQuery } from '@/api/tool/generator/types'

const proxy = getProxy()

const state = reactive({
  // 遮罩层
  loading: false,
  // 选中数据数组
  importTableNames: [] as string[],
  // 总条数
  total: 0,
  // 导入表数据
  importTableList: [] as GenTable[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as GenTableQuery,
  // 对话框
  importTableDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  // 表单
  importTableForm: {} as GenTableForm
})

const {
  loading,
  importTableNames,
  total,
  importTableList,
  queryParams,
  importTableDialog,
  importTableForm
} = toRefs(state)

const genTableRuleFormRef = ref<FormInstance>()
const genTableQueryFormRef = ref<FormInstance>()

// 查询代码生成列表
const handleList = async () => {
  state.loading = true
  const res: any = await listDatabaseTable(state.queryParams)
  state.importTableList = res.rows
  state.total = res.total
  state.loading = false
}

// 导入表信息
const handleImport = async () => {
  const tableNames = importTableNames.value.toString()
  await importTable({ tableNames })
  proxy.$message.success('添加代码生成信息成功')
  closeImportTableDialog()
  proxy.$emit('submitted')
}

// 显示对话框
const handleShow = async () => {
  await handleList()
  state.importTableDialog = {
    title: '导入表信息',
    type: 'import',
    visible: true
  }
}

// 重置表单
const resetQuery = async () => {
  proxy.$resetForm(genTableQueryFormRef.value)
  await handleList()
}

// 关闭对话框
const closeImportTableDialog = () => {
  state.importTableDialog.visible = false
  proxy.$resetForm(genTableRuleFormRef.value)
}

// 多选框
const handleSelectionChange = (selection: any) => {
  state.importTableNames = selection.map((item: any) => item.tableName)
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    if (importTableDialog.value.type == 'import') {
      await handleImport()
    }
  } catch (error) {
    console.log('error submit!', error)
  }
}

defineExpose({
  handleShow
})
</script>

<style lang="scss" scoped>
</style>
