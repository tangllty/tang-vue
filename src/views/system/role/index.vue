<template>
  <div>
    <!-- 信息检索 -->
    <el-card style="margin-bottom: 10px;">
      <el-form ref="roleQueryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="角色名称"
            style="width: 200px"
            @keyup.enter="handleList"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input
            v-model="queryParams.status"
            placeholder="状态"
            style="width: 200px"
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

    <!-- 角色数据 -->
    <el-card>

      <!-- 角色操作 -->
      <template #header>
        <el-row class="mb-8">
          <el-button
            type="primary"
            :icon="Plus"
            @click="handleAdd"
          >新增</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            @click="handleDelete"
          >删除</el-button>
        </el-row>
      </template>

      <!-- 角色表格 -->
      <el-table
        v-loading="loading"
        :data="roleList"
        row-key="roleId"
        lazy
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="roleName"
          label="角色名称"
          align="center"
        />
        <el-table-column
          prop="roleKey"
          label="权限字符"
          align="center"
        />
        <el-table-column
          prop="sort"
          label="显示顺序"
          align="center"
        />
        <el-table-column
          prop="dataScope"
          label="数据范围"
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
              :icon="Edit"
              size="small"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              type="primary"
              link
              :icon="Delete"
              size="small"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加或修改角色信息对话框 -->
    <el-dialog
      :title="roleDialog.title"
      v-model="roleDialog.visible"
      @close="closeUserDialog"
    >
      <el-form
        ref="roleRuleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="120px"
        status-icon
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="roleForm.roleName"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input
            v-model="roleForm.roleKey"
            placeholder="请输入权限字符"
          />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number
            v-model="roleForm.roleSort"
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
            @click="submitForm(roleRuleFormRef)"
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
import { listRole, getRole, addRole, editRole, deleteRole } from '@/api/system/role'
import { SysRole as Role, SysRoleForm, SysRoleQuery as RoleQuery } from '@/api/system/role/types'



const state = reactive({
  // 遮罩层
  loading: false,
  // 选中数据
  roleId: 0 as number,
  // 选中数据数组
  roleIds: [] as number[],
  // 角色数据
  roleList: [] as Role[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as RoleQuery,
  // 对话框
  roleDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  // 表单
  roleForm: {
  } as SysRoleForm
})

const {
  loading,
  roleIds,
  roleList,
  queryParams,
  roleDialog,
  roleForm
} = toRefs(state)

const roleRuleFormRef = ref<FormInstance>()
const roleQueryFormRef = ref<FormInstance>()
const roleRules = reactive<FormRules>({
  roleName: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' },
    { min: 2, max: 32, message: '角色名称长度应在 2 到 32 之间', trigger: 'blur' },
  ],
  roleKey: [
    { required: true, message: '权限字符不能为空', trigger: 'blur' },
    { min: 2, max: 32, message: '权限字符长度应在 2 到 64 之间', trigger: 'blur' },
  ],
})

// 查询角色列表
function handleList() {
  state.loading = true
  listRole(state.queryParams).then((res:any) => {
    state.roleList = res.data
    state.loading = false
  })
}

// 添加角色信息
function handleAdd(row: any) {
  state.roleDialog = {
    title: '新增角色信息',
    type: 'add',
    visible: true
  }
}

// 修改角色信息
function handleEdit(row: any) {
  state.roleForm = row
  state.roleDialog = {
    title: '修改角色信息',
    type: 'edit',
    visible: true
  }
}

// 删除角色信息
function handleDelete(row: any) {
  deleteRole(row.roleId).then(() => {
    ElMessage.success("删除角色信息成功")
    handleList()
  })
}

// 重置表单
function resetQuery() {
  roleQueryFormRef.value?.resetFields()
  handleList()
}

// 关闭对话框
function closeUserDialog() {
  state.roleDialog.visible = false
  roleRuleFormRef.value?.clearValidate()
  roleRuleFormRef.value?.resetFields()
}

// 多选框
function handleSelectionChange(selection: any) {
  state.roleIds = selection.map((item: any) => item.roleId)
  if (selection.length === 1) {
    state.roleId = roleIds.value[0]
  }
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (roleDialog.value.type == 'add') {
        addRole(state.roleForm).then(() => {
          ElMessage.success("添加角色信息成功")
          closeUserDialog()
          handleList()
        })
      }
      if (roleDialog.value.type == 'edit') {
        editRole(state.roleForm).then(() => {
          ElMessage.success("修改角色信息成功")
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
