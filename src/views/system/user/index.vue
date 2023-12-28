<template>
  <div>
    <el-row :gutter="20">

      <!-- 部门树 -->
      <el-col :span="4">
        <el-card>
          <DeptTree
            v-model:deptId="queryParams.deptId"
            @nodeClick="handleList"
          />
        </el-card>
      </el-col>

      <!-- 用户数据 -->
      <el-col :span="20">

        <!-- 信息检索 -->
        <el-card class="mb-10">
          <el-form
            ref="userQueryFormRef"
            :model="queryParams"
            inline
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="queryParams.username"
                placeholder="用户名"
                clearable
                @keyup.enter="handleList"
              />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input
                v-model="queryParams.nickname"
                placeholder="昵称"
                clearable
                @keyup.enter="handleList"
              />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select
                v-model="queryParams.gender"
                placeholder="性别"
                clearable
                @keyup.enter="handleList"
              >
                <el-option
                  v-for="item in sys_user_gender"
                  :key="item.dataId"
                  :label="item.dataLabel"
                  :value="item.dataValue"
                />
              </el-select>
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

        <!-- 用户操作 -->
        <el-card>
          <template #header>
            <el-row>
              <el-button
                type="primary"
                :icon="Plus"
                v-hasPermission="'system:user:add'"
                @click="handleAdd"
              >新增</el-button>
              <el-button
                type="success"
                :icon="Edit"
                :disabled="userIds.length !== 1"
                v-hasPermission="'system:user:edit'"
                @click="handleEdit"
              >修改</el-button>
              <el-button
                type="danger"
                :icon="Delete"
                :disabled="userIds.length === 0"
                v-hasPermission="'system:user:delete'"
                @click="handleDeletes"
              >删除</el-button>
              <el-dropdown
                type="info"
                :icon="Upload"
                split-button
                @click="handleImport"
                class="ml-12 mr-12"
              >
                <el-icon><Upload /></el-icon><span class="ml-6">导入</span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleExportTemplate">下载模板</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button
                type="warning"
                :icon="Download"
                @click="handleExport"
              >导出</el-button>
            </el-row>
          </template>

          <!-- 用户表格 -->
          <el-table
            v-loading="loading"
            :data="userList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              label="用户编号"
              prop="userId"
              align="center"
              width="100"
            />
            <el-table-column
              label="部门名称"
              prop="dept.deptName"
              align="center"
              width="100"
            />
            <el-table-column
              label="用户名"
              prop="username"
              align="center"
            />
            <el-table-column
              label="昵称"
              prop="nickname"
              align="center"
            />
            <el-table-column
              label="邮箱"
              prop="email"
              align="center"
              width="160"
              show-overflow-tooltip
            />
            <el-table-column
              label="手机号码"
              prop="phone"
              align="center"
              width="120"
            />
            <el-table-column
              label="性别"
              prop="gender"
              align="center"
            >
              <template #default="scope">
                <dict-tag :data="sys_user_gender" :value="scope.row.gender" />
              </template>
            </el-table-column>
            <el-table-column
              label="头像"
              prop="avatar"
              align="center"
            >
              <template #default="scope">
                <el-image
                  :src="proxy.$path(scope.row.avatar)"
                  class="user-avatar"
                  fit="cover"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              prop="status"
              align="center"
              width="80"
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
              label="最后登录IP"
              prop="loginIp"
              width="120"
              align="center"
            />
            <el-table-column
              label="最后登录时间"
              prop="loginDate"
              width="160"
              align="center"
            />
            <el-table-column
              label="创建时间"
              prop="createTime"
              width="160"
              align="center"
            />
            <el-table-column
              label="操作"
              align="center"
              width="130"
            >
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  size="small"
                  :icon="Edit"
                  v-hasPermission="'system:user:edit'"
                  @click="handleEdit(scope.row)"
                >编辑</el-button>
                <el-button
                  type="primary"
                  link
                  size="small"
                  :icon="Delete"
                  v-hasPermission="'system:user:delete'"
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
      </el-col>
    </el-row>

    <!-- 添加或修改用户信息对话框 -->
    <el-dialog
      :title="userDialog.title"
      v-model="userDialog.visible"
      @close="closeUserDialog"
    >
      <el-form
        ref="userRuleFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="120px"
        status-icon
      >
        <el-form-item label="部门" prop="deptId">
          <el-tree-select
            v-model="userForm.deptId"
            :data="deptTree"
            check-strictly
            filterable
            placeholder="请输入部门"
          />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="userForm.username"
            placeholder="请输入用户名"
            maxlength="32"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="userForm.nickname"
            placeholder="请输入昵称"
            maxlength="32"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="userForm.email"
            placeholder="请输入邮箱"
            maxlength="64"
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="userForm.phone"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </el-form-item>
        <el-form-item
          v-if="userDialog.type === 'add'"
          label="密码"
          prop="password"
        >
          <el-input
            v-model="userForm.password"
            placeholder="请输入密码"
            maxlength="32"
            show-password
          />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="userForm.gender">
            <el-radio
              v-for="item in sys_user_gender"
              :key="item.dataId"
              :label="item.dataValue"
            >{{ item.dataLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="userForm.roleIds"
            placeholder="请选择角色"
            multiple
          >
            <el-option
              v-for="role in roleSelect"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="userForm.remark"
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
            @click="submitForm(userRuleFormRef)"
          >确 定</el-button>
          <el-button
            @click="closeUserDialog"
          >取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <ImportUser ref="importUserRef" @submitted="handleList" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Download, Upload, Search, Refresh } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { listUser, addUser, getUser, listRoleSelect, editUser, changeStatus, deleteUser, deleteUsers, exportUser, exportUserTemplate } from '@/api/system/user'
import { listDeptTree } from '@/api/system/dept'
import { SysUser, SysUserForm, SysUserQuery } from '@/api/system/user/types'
import DeptTree from './DeptTree.vue'
import ImportUser from './ImportUser.vue'

const proxy = getProxy()
const { sys_user_gender, sys_status } = proxy.$dict('sys_user_gender', 'sys_status')

const state = reactive({
  // 遮罩层
  loading: true,
  // 选中数据
  userId: 0 as number,
  // 选中数据数组
  userIds: [] as number[],
  // 总条数
  total: 0,
  // 用户表格数据
  userList: [] as SysUser[],
  // 部门树数据
  deptTree: [] as TreeSelect[],
  // 角色下拉框数据
  roleSelect: [] as TreeSelect[],
  // 查询参数
  queryParams: {} as SysUserQuery,
  // 对话框
  userDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  // 表单
  userForm: {} as SysUserForm
})

const {
  loading,
  userIds,
  total,
  userList,
  deptTree,
  roleSelect,
  queryParams,
  userDialog,
  userForm
} = toRefs(state)

const importUserRef = ref<InstanceType<typeof ImportUser>>()
const userRuleFormRef = ref<FormInstance>()
const userQueryFormRef = ref<FormInstance>()
const userRules = reactive<FormRules>({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 4, max: 32, message: '用户名长度应在 4 到 32 之间', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    { min: 2, max: 32, message: '昵称长度应在 4 到 32 之间', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  phone: [
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 4, max: 32, message: '密码长度应在 4 到 32 之间', trigger: 'blur' },
  ],
  deptId: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
  roleIds: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
})

// 查询用户列表
const handleList = async () => {
  state.loading = true
  const res: any = await listUser(state.queryParams)
  state.userList = res.rows
  state.total = res.total
  state.loading = false
}

// 添加用户信息
const handleAdd = async () => {
  state.userForm = {
    password: '123456',
    gender: '0'
  } as SysUserForm

  await getRoleSelect()

  state.userDialog = {
    title: '新增用户信息',
    type: 'add',
    visible: true
  }
}

// 修改用户信息
const handleEdit = async (row: any) => {
  let userId = state.userId
  if (row.userId) {
    userId = row.userId
  }
  const res: any = await getUser(userId)
  state.userForm = res.data
  await getRoleSelect()

  state.userDialog = {
    title: '修改用户信息',
    type: 'edit',
    visible: true
  }
}

// 删除用户信息
const handleDelete = async (row: any) => {
  try {
    await proxy.$confirm('确认要删除"' + row.username + '"用户信息吗?', '警告', {
      type: 'warning'
    })
    await deleteUser(row.userId)
    proxy.$message.success('删除用户信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

// 批量删除用户信息
const handleDeletes = async () => {
  try {
    await proxy.$confirm('确认要删除"' + state.userIds + '"用户信息吗?', '警告', {
      type: 'warning'
    })
    await deleteUsers(state.userIds)
    proxy.$message.success('删除用户信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

// 导入用户信息
const handleImport = async () => {
  importUserRef.value?.handleImport()
}

// 导出用户信息
const handleExport = async () => {
  const res: any = await exportUser(state.queryParams)
  proxy.$download(res)
}

// 导出用户信息模板
const handleExportTemplate = async () => {
  const res: any = await exportUserTemplate()
  proxy.$download(res)
}

// 查询部门树
const getDeptTree = async () => {
  const res: any = await listDeptTree()
  state.deptTree = res.data
}

// 查询角色下拉框
const getRoleSelect = async () => {
  const res: any = await listRoleSelect()
  state.roleSelect = res.data
}

// 重置表单
const resetQuery = async () => {
  proxy.$resetForm(userQueryFormRef.value)
  await handleList()
}

// 关闭对话框
const closeUserDialog = () => {
  state.userForm.password = '123456'
  state.userDialog.visible = false
  proxy.$resetForm(userRuleFormRef.value)
}

// 修改用户状态
const handleChangeStatus = async (row: SysUser) => {
  const text = row.status === '0' ? '启用' : '停用'
  try {
    await proxy.$confirm('确认要' + text + '"' + row.username + '"用户吗?', '警告', {
      type: 'warning'
    })
    await changeStatus(row.userId, row.status)
    proxy.$message.success(text + '成功')
    await handleList()
  } catch (error) {
    row.status = row.status === '1' ? '0' : '1'
  }
}

// 多选框
const handleSelectionChange = (selection: any) => {
  state.userIds = selection.map((item: any) => item.userId)
  if (selection.length === 1) {
    state.userId = userIds.value[0]
  }
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    if (state.userDialog.type == 'add') {
      await addUser(state.userForm)
      proxy.$message.success('添加用户信息成功')
      closeUserDialog()
      await handleList()
    }
    if (state.userDialog.type == 'edit') {
      await editUser(state.userForm)
      proxy.$message.success('修改用户信息成功')
      closeUserDialog()
      await handleList()
    }
  } catch (error) {
    console.log('error submit!', error)
  }
}

onMounted(async () => {
  await getDeptTree()
  await handleList()
})
</script>

<style lang="scss" scoped>
.user-avatar {
  width: 50px;
  height: 50px;
}
</style>
