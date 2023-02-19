<template>
  <div>
    <!-- 信息检索 -->
    <el-card style="margin-bottom: 10px;">
      <el-form ref="deptQueryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="queryParams.deptName"
            placeholder="部门名称"
            style="width: 200px"
            clearable
            @keyup.enter="handleList"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="状态"
            style="width: 200px"
            clearable
          >
            <el-option label="正常" value="0" />
            <el-option label="停用" value="1" />
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

    <!-- 部门数据 -->
    <el-card>

      <!-- 部门操作 -->
      <template #header>
        <el-row class="mb-8">
          <el-button
            type="primary"
            :icon="Plus"
            v-hasPermission="'system:dept:add'"
            @click="handleAdd"
          >新增</el-button>
        </el-row>
      </template>

      <!-- 部门表格 -->
      <el-table
        v-loading="loading"
        :data="deptList"
        row-key="deptId"
        lazy
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          prop="deptName"
          label="部门名称"
        />
        <el-table-column
          prop="sort"
          label="显示顺序"
          width="80"
          align="center"
        />
        <el-table-column
          label="状态"
          align="center"
          width="80"
          prop="status"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleChangeStatus(scope.row)"
            />
          </template>
        </el-table-column>
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
          width="190"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="primary"
              link
              :icon="Plus"
              size="small"
              v-hasPermission="'system:dept:add'"
              @click="handleAdd(scope.row)"
            >新增</el-button>
            <el-button
              type="primary"
              link
              :icon="Edit"
              size="small"
              v-hasPermission="'system:dept:edit'"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              type="primary"
              link
              :icon="Delete"
              size="small"
              v-hasPermission="'system:dept:delete'"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加或修改部门信息对话框 -->
    <el-dialog
      :title="deptDialog.title"
      v-model="deptDialog.visible"
      @close="closeUserDialog"
    >
      <el-form
      ref="deptRuleFormRef"
      :model="deptForm"
      :rules="deptRules"
      label-width="120px"
      status-icon
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-tree-select
            v-model="deptForm.parentId"
            :data="deptTree"
            :render-after-expand="false"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="deptForm.deptName"
            placeholder="请输入部门名称"
          />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number
            v-model="deptForm.sort"
            :min="1"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="deptForm.remark"
            placeholder="请输入备注"
            type="textarea"
            maxlength="500"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitForm(deptRuleFormRef)"
          >确 定</el-button>
          <el-button
            @click="closeUserDialog"
          >取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'
import { listDept, deptTree as selectDeptTree, addDept, editDept, changeStatus, deleteDept } from '@/api/system/dept'
import { SysDept, SysDeptForm, SysDeptQuery } from '@/api/system/dept/types'

const state = reactive({
  // 遮罩层
  loading: false,
  // 选中数据
  deptId: 0 as number,
  // 选中数据数组
  deptIds: [] as number[],
  // 部门数据
  deptList: [] as SysDept[],
  // 部门树数据
  deptTree: [] as TreeSelect[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as SysDeptQuery,
  // 对话框
  deptDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  // 表单
  deptForm: {
    sort: 1
  } as SysDeptForm
})

const {
  loading,
  deptIds,
  deptList,
  deptTree,
  queryParams,
  deptDialog,
  deptForm
} = toRefs(state)

const deptRuleFormRef = ref<FormInstance>()
const deptQueryFormRef = ref<FormInstance>()
const deptRules = reactive<FormRules>({
  deptName: [
    { required: true, message: '部门名称不能为空', trigger: 'blur' },
    { min: 2, max: 32, message: '部门名称长度应在 2 到 32 之间', trigger: 'blur' },
  ],
})

// 查询部门列表
function handleList() {
  state.loading = true
  listDept(state.queryParams).then((res:any) => {
    state.deptList = res.data
    state.loading = false
  })
}

// 查询部门树
function getDeptTree() {
  selectDeptTree().then((res:any) => {
    state.deptTree = res.data
  })
}

// 添加部门信息
function handleAdd(row: any) {
  getDeptTree()
  state.deptForm.parentId = row.deptId
  state.deptDialog = {
    title: '新增部门信息',
    type: 'add',
    visible: true
  }
}

// 修改部门信息
function handleEdit(row: any) {
  getDeptTree()
  state.deptForm = row
  state.deptDialog = {
    title: '修改部门信息',
    type: 'edit',
    visible: true
  }
}

// 删除部门信息
function handleDelete(row: any) {
  ElMessageBox.confirm('确认要删除"' + row.deptName + '"部门吗?', '警告', {
      type: 'warning'
    }
  ).then(() => {
    deleteDept(row.deptId).then(() => {
      ElMessage.success("删除部门信息成功")
      handleList()
    })
  })
}

// 重置表单
function resetQuery() {
  deptQueryFormRef.value?.resetFields()
  handleList()
}

// 关闭对话框
function closeUserDialog() {
  state.deptDialog.visible = false
  deptRuleFormRef.value?.clearValidate()
  deptRuleFormRef.value?.resetFields()
}

// 修改部门状态
function handleChangeStatus(row: SysDept) {
  const text = row.status === '0' ? '启用' : '停用';
  ElMessageBox.confirm('确认要' + text + '"' + row.deptName + '"部门吗?', '警告', {
      type: 'warning'
    }
  ).then(() => {
    return changeStatus(row.deptId, row.status)
  }).then(() => {
    ElMessage.success(text + '成功')
  }).catch(() => {
    row.status = row.status === '1' ? '0' : '1'
  })
}

// 多选框
function handleSelectionChange(selection: any) {
  state.deptIds = selection.map((item: any) => item.deptId)
  if (selection.length === 1) {
    state.deptId = deptIds.value[0]
  }
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (deptDialog.value.type == 'add') {
        addDept(state.deptForm).then(() => {
          ElMessage.success("添加部门信息成功")
          closeUserDialog()
          handleList()
        })
      }
      if (deptDialog.value.type == 'edit') {
        editDept(state.deptForm).then(() => {
          ElMessage.success("修改部门信息成功")
          closeUserDialog()
          handleList()
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

onMounted(() => {
  handleList()
})
</script>

<style lang="scss" scoped>
</style>
