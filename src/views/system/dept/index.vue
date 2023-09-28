<template>
  <div>
    <!-- 信息检索 -->
    <el-card class="mb-10">
      <el-form ref="deptQueryFormRef" :model="queryParams" inline>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="queryParams.deptName"
            placeholder="部门名称"
            clearable
            @keyup.enter="handleList"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="状态"
            clearable
          >
            <el-option
              v-for="item in sys_status"
              :key="item.dataId"
              :label="item.dataLabel"
              :value="item.dataValue"
            />
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
        <el-row>
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
      >
        <el-table-column
          prop="deptName"
          label="部门名称"
        />
        <el-table-column
          prop="sort"
          label="显示顺序"
          width="100"
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
      @close="closeDeptDialog"
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
            @click="closeDeptDialog"
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
import { listDept, deptTree as selectDeptTree, getDept, addDept, editDept, changeStatus, deleteDept } from '@/api/system/dept'
import { SysDept, SysDeptForm, SysDeptQuery } from '@/api/system/dept/types'

const proxy = getProxy()
const { sys_status } = proxy.$dict('sys_status')

const state = reactive({
  // 遮罩层
  loading: false,
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
  deptForm: {} as SysDeptForm
})

const {
  loading,
  deptList,
  deptTree,
  queryParams,
  deptDialog,
  deptForm
} = toRefs(state)

const deptRuleFormRef = ref<FormInstance>()
const deptQueryFormRef = ref<FormInstance>()
const deptRules = reactive<FormRules>({
  parentId: [
    { required: true, message: '上级部门不能为空', trigger: 'blur' }
  ],
  deptName: [
    { required: true, message: '部门名称不能为空', trigger: 'blur' },
    { min: 2, max: 32, message: '部门名称长度应在 2 到 32 之间', trigger: 'blur' },
  ],
})

// 查询部门列表
const handleList = async () => {
  state.loading = true
  const res: any = await listDept(state.queryParams)
  state.deptList = res.data
  state.loading = false
}

// 查询部门树
const getDeptTree = async () => {
  const res: any = await selectDeptTree()
  state.deptTree = res.data
}

// 添加部门信息
const handleAdd = async (row: any) => {
  state.deptForm = {
    sort: 1
  } as SysDeptForm

  await getDeptTree()

  state.deptForm.parentId = row.deptId
  state.deptDialog = {
    title: '新增部门信息',
    type: 'add',
    visible: true
  }
}

// 修改部门信息
const handleEdit = async (row: any) => {
  await getDeptTree()
  const res: any = await getDept(row.deptId)
  state.deptForm = res.data
  state.deptDialog = {
    title: '修改部门信息',
    type: 'edit',
    visible: true
  }
}

// 删除部门信息
const handleDelete = async (row: any) => {
  try {
    await proxy.$confirm('确认要删除"' + row.deptName + '"部门信息吗?', '警告', {
      type: 'warning'
    })
    await deleteDept(row.deptId)
    proxy.$message.success('删除部门信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

// 重置表单
const resetQuery = async () => {
  deptQueryFormRef.value?.resetFields()
  await handleList()
}

// 关闭对话框
const closeDeptDialog = () => {
  state.deptDialog.visible = false
  deptRuleFormRef.value?.clearValidate()
  deptRuleFormRef.value?.resetFields()
}

// 修改部门状态
const handleChangeStatus = async (row: SysDept) => {
  const text = row.status === '0' ? '启用' : '停用'
  try {
    await proxy.$confirm('确认要' + text + '"' + row.deptName + '"部门吗?', '警告', {
      type: 'warning'
    })
    await changeStatus(row.deptId, row.status)
    proxy.$message.success(text + '成功')
    await handleList()
  } catch (error) {
    row.status = row.status === '1' ? '0' : '1'
  }
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    if (deptDialog.value.type == 'add') {
      await addDept(state.deptForm)
      proxy.$message.success('添加部门信息成功')
      closeDeptDialog()
      await handleList()
    }
    if (deptDialog.value.type == 'edit') {
      await editDept(state.deptForm)
      proxy.$message.success('修改部门信息成功')
      closeDeptDialog()
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
