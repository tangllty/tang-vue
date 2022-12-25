<template>
  <div>
    <el-card style="margin-bottom: 10px;">
      <el-form ref="deptQueryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="状态" prop="status">
          <el-input
            v-model="queryParams.status"
            placeholder="状态"
            style="width: 200px"
            @keyup.enter="list"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :icon="Search"
            @click="list"
          >搜索</el-button>
          <el-button
            :icon="Refresh"
            @click="resetQuery"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <template #header>
        <el-row class="mb-8">
          <el-button
            type="primary"
            :icon="Plus"
            @click="add"
          >新增</el-button>

        </el-row>
      </template>
      <el-table
        v-loading="loading"
        :data="deptList"
        row-key="deptId"
        lazy
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="deptName" label="部门名称" />
        <el-table-column prop="orderNum" label="显示顺序" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column prop="updateTime" label="更新时间" align="center" />
        <el-table-column label="操作" width="190" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              link
              :icon="Plus"
              size="small"
              @click="add(scope.row)"
            >新增</el-button>
            <el-button
              type="primary"
              link
              :icon="Edit"
              size="small"
              @click="edit(scope.row)"
            >修改</el-button>
            <el-button
              type="primary"
              link
              :icon="Delete"
              size="small"
              @click="deleteDept(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

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
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="deptForm.deptName" placeholder="请输入部门名称" />
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
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'
import { list as getDeptList, deptTree as selectDeptTree, getDept, add as addDept, edit as editDept, deleteDept as deleteDeptByDeptId } from '@/api/system/dept'
import { SysDept as Dept, SysDeptForm, SysDeptQuery as DeptQuery } from '@/api/system/dept/types'

const state = reactive({
  loading: false,
  deptId: 0 as number,
  deptIds: [] as number[],
  deptList: [] as Dept[],
  deptTree: [] as TreeSelect[],
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as DeptQuery,
  deptDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  deptForm: {
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
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' },
  ],
})

function list() {
  state.loading = true
  getDeptList(state.queryParams).then((res:any) => {
    state.deptList = res.data
    state.loading = false
  })
}

function getDeptTree() {
  selectDeptTree(state.queryParams).then((res:any) => {
    state.deptTree = res.data
  })
}

function add(row: any) {
  getDeptTree()
  state.deptForm.parentId = row.deptId
  state.deptDialog = {
    title: '新增部门信息',
    type: 'add',
    visible: true
  }
}

function edit(row: any) {
  getDeptTree()
  state.deptForm.parentId = row.parentId
  state.deptForm.deptId = row.deptId
  state.deptDialog = {
    title: '修改部门信息',
    type: 'edit',
    visible: true
  }
}


function deleteDept(row: any) {
  deleteDeptByDeptId(row.deptId).then(() => {
    ElMessage.success("删除部门信息成功")
    list()
  })
}

function resetQuery() {
  deptQueryFormRef.value?.resetFields()
  list()
}

function closeUserDialog() {
  state.deptDialog.visible = false
  deptRuleFormRef.value?.clearValidate()
  deptRuleFormRef.value?.resetFields()
}

function handleSelectionChange(selection: any) {
  state.deptIds = selection.map((item: any) => item.deptId)
  if (selection.length === 1) {
    state.deptId = deptIds.value[0]
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (deptDialog.value.type == 'add') {
        addDept(state.deptForm).then(() => {
          ElMessage.success("添加部门信息成功")
          closeUserDialog()
          list()
        })
      }
      if (deptDialog.value.type == 'edit') {
        editDept(state.deptForm).then(() => {
          ElMessage.success("修改部门信息成功")
          closeUserDialog()
          list()
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

onMounted(() => {
  list()
})
</script>

<style lang="scss" scoped>
</style>
