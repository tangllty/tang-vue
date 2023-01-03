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
            @keyup.enter="list"
          />
        </el-form-item>
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

    <!-- 部门数据 -->
    <el-card>

      <!-- 部门操作 -->
      <template #header>
        <el-row class="mb-8">
          <el-button
            type="primary"
            :icon="Plus"
            @click="add"
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
          align="center"
        />
        <el-table-column
          prop="orderNum"
          label="显示顺序"
          align="center"
        />
        <el-table-column
          prop="status"
          label="状态"
          align="center"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
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
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number
            v-model="deptForm.orderNum"
            :min="1"
            :max="9999"
            controls-position="right"
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
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'
import { list as getDeptList, deptTree as selectDeptTree, getDept, add as addDept, edit as editDept, deleteDept as deleteDeptByDeptId } from '@/api/system/dept'
import { SysDept as Dept, SysDeptForm, SysDeptQuery as DeptQuery } from '@/api/system/dept/types'

const state = reactive({
  // 遮罩层
  loading: false,
  // 选中数据
  deptId: 0 as number,
  // 选中数据数组
  deptIds: [] as number[],
  // 部门数据
  deptList: [] as Dept[],
  // 部门树数据
  deptTree: [] as TreeSelect[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as DeptQuery,
  // 对话框
  deptDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  // 表单
  deptForm: {
    orderNum: 1
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
function list() {
  state.loading = true
  getDeptList(state.queryParams).then((res:any) => {
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
function add(row: any) {
  getDeptTree()
  state.deptForm.parentId = row.deptId
  state.deptDialog = {
    title: '新增部门信息',
    type: 'add',
    visible: true
  }
}

// 修改部门信息
function edit(row: any) {
  getDeptTree()
  state.deptForm = row
  state.deptDialog = {
    title: '修改部门信息',
    type: 'edit',
    visible: true
  }
}

// 删除部门信息
function deleteDept(row: any) {
  deleteDeptByDeptId(row.deptId).then(() => {
    ElMessage.success("删除部门信息成功")
    list()
  })
}

// 充值表单
function resetQuery() {
  deptQueryFormRef.value?.resetFields()
  list()
}

// 关闭对话框
function closeUserDialog() {
  state.deptDialog.visible = false
  deptRuleFormRef.value?.clearValidate()
  deptRuleFormRef.value?.resetFields()
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
