<template>
  <div>
    <!-- 信息检索 -->
    <el-card style="margin-bottom: 10px;">
      <el-form ref="roleQueryFormRef" :model="queryParams" inline>
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryParams.roleName"
            placeholder="角色名称"
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

    <!-- 角色数据 -->
    <el-card>

      <!-- 角色操作 -->
      <template #header>
        <el-row class="mb-8">
          <el-button
            type="primary"
            :icon="Plus"
            v-hasPermission="'system:role:add'"
            @click="handleAdd"
          >新增</el-button>
          <el-button
            type="success"
            :icon="Edit"
            :disabled="roleIds.length !== 1"
            v-hasPermission="'system:role:edit'"
            @click="handleEdit"
          >修改</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="roleIds.length === 0"
            v-hasPermission="'system:role:delete'"
            @click="handleDeletes"
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
          width="80"
          align="center"
        />
        <el-table-column
          label="状态"
          width="80"
          align="center"
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
              :icon="Edit"
              size="small"
              v-hasPermission="'system:role:edit'"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              type="primary"
              link
              :icon="Delete"
              size="small"
              v-hasPermission="'system:role:delete'"
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

    <!-- 添加或修改角色信息对话框 -->
    <el-dialog
      :title="roleDialog.title"
      v-model="roleDialog.visible"
      @close="closeRoleDialog"
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
            v-model="roleForm.sort"
            :min="1"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="菜单权限" prop="menuIds">
          <el-tree
            ref="menuTreeRef"
            :data="menuTree"
            node-key="value"
            :props="{ children: 'children', label: 'label' }"
            show-checkbox
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="roleForm.remark"
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
            @click="submitForm(roleRuleFormRef)"
          >确 定</el-button>
          <el-button
            @click="closeRoleDialog"
          >取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElTree, FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { listRole, getRole, addRole, editRole, changeStatus, deleteRole, deleteRoles } from '@/api/system/role'
import { menuTree as selectMenuTree } from '@/api/system/menu'
import { SysRole , SysRoleForm, SysRoleQuery } from '@/api/system/role/types'

const proxy = getProxy()
const { sys_status } = proxy.$dict('sys_status')

const state = reactive({
  // 遮罩层
  loading: false,
  // 选中数据
  roleId: 0 as number,
  // 选中数据数组
  roleIds: [] as number[],
  // 总条数
  total: 0,
  // 角色数据
  roleList: [] as SysRole[],
  // 菜单树数据
  menuTree: [] as TreeSelect[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as SysRoleQuery,
  // 对话框
  roleDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  // 表单
  roleForm: {} as SysRoleForm
})

const {
  loading,
  roleIds,
  total,
  roleList,
  menuTree,
  queryParams,
  roleDialog,
  roleForm
} = toRefs(state)

const menuTreeRef = ref<InstanceType<typeof ElTree>>()
const roleRuleFormRef = ref<FormInstance>()
const roleQueryFormRef = ref<FormInstance>()
const roleRules = reactive<FormRules>({
  roleName: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' },
    { min: 2, max: 32, message: '角色名称长度应在 2 到 32 之间', trigger: 'blur' },
  ],
  roleKey: [
    { required: true, message: '权限字符不能为空', trigger: 'blur' },
    { min: 2, max: 64, message: '权限字符长度应在 2 到 64 之间', trigger: 'blur' },
  ],
})

// 查询角色列表
const handleList = () => {
  state.loading = true
  listRole(state.queryParams).then((res:any) => {
    state.roleList = res.rows
    state.total = res.total
    state.loading = false
  })
}

// 添加角色信息
const handleAdd = () => {
  state.roleForm = {
    sort: 1
  } as SysRoleForm

  getMenuTree()

  state.roleDialog = {
    title: '新增角色信息',
    type: 'add',
    visible: true
  }
}

// 查询菜单树
const getMenuTree = () => {
  selectMenuTree().then((res:any) => {
    state.menuTree = res.data
  })
}

// 修改角色信息
const handleEdit = (row: any) => {
  let roleId = state.roleId
  if (row.roleId) {
    roleId = row.roleId
  }
  getMenuTree()
  getRole(roleId).then((res: any) => {
    state.roleForm = res.data
    const menuIds = res.data.menuIds
    menuIds.forEach((menuId: number) => menuTreeRef.value?.setChecked(menuId, true, false))
  })

  state.roleDialog = {
    title: '修改角色信息',
    type: 'edit',
    visible: true
  }
}

// 修改角色状态
const handleChangeStatus = (row: SysRole) => {
  const text = row.status === '0' ? '启用' : '停用'
  proxy.$confirm('确认要' + text + '"' + row.roleName + '"角色吗?', '警告', {
    type: 'warning'
  }).then(() => {
    changeStatus(row.roleId, row.status).then(() => {
      proxy.$message.success(text + '成功')
      handleList()
    })
  }).catch(() => {
    row.status = row.status === '1' ? '0' : '1'
  })
}

// 删除角色信息
const handleDelete = (row: any) => {
  proxy.$confirm('确认要删除"' + row.roleName + '"角色信息吗?', '警告', {
    type: 'warning'
  }).then(() => {
    deleteRole(row.roleId).then(() => {
      proxy.$message.success("删除角色信息成功")
      handleList()
    })
  })
}

// 批量删除角色信息
const handleDeletes = () => {
  proxy.$confirm('确认要删除"' + state.roleIds + '"角色信息吗?', '警告', {
    type: 'warning'
  }).then(() => {
    deleteRoles(state.roleIds).then(() => {
      proxy.$message.success("删除角色信息成功")
      handleList()
    })
  })
}

// 重置表单
const resetQuery = () => {
  roleQueryFormRef.value?.resetFields()
  handleList()
}

// 关闭对话框
const closeRoleDialog = () => {
  state.roleDialog.visible = false
  roleRuleFormRef.value?.clearValidate()
  roleRuleFormRef.value?.resetFields()
}

// 多选框
const handleSelectionChange = (selection: any) => {
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
      const halfCheckedNodes = menuTreeRef.value?.getHalfCheckedNodes()
      const checkedNodes = menuTreeRef.value?.getCheckedNodes()
      const menuIds: number[] = []
      halfCheckedNodes?.forEach(halfCheckedNode => menuIds.push(halfCheckedNode.value))
      checkedNodes?.forEach(checkedNode => menuIds.push(checkedNode.value))
      state.roleForm.menuIds = menuIds

      if (roleDialog.value.type == 'add') {
        addRole(state.roleForm).then(() => {
          proxy.$message.success("添加角色信息成功")
          closeRoleDialog()
          handleList()
        })
      }
      if (roleDialog.value.type == 'edit') {
        editRole(state.roleForm).then(() => {
          proxy.$message.success("修改角色信息成功")
          closeRoleDialog()
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
