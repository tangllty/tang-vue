<template>
  <div>
    <el-row :gutter="20">

      <!-- 部门树 -->
      <el-col :span="4">
        <el-card>
          <el-input
            v-model="deptName"
            placeholder="部门名称"
            clearable
            :prefix-icon="Search"
            style="margin-bottom: 20px"
          />
          <el-tree
            ref="deptTreeRef"
            :data="deptTree"
            :props="{ children: 'children', label: 'label' }"
            :expand-on-click-node="false"
            default-expand-all
            :filter-node-method="filterNode"
            @node-click="handleDeptNodeClick"
          />
          <!--
            TODO 不明错误提示
            :filter-node-method="filterNode" 会提示以下错误

            Type '(value: string, data: TreeSelect) => boolean' is not assignable to type 'FilterNodeMethodFunction'.
            Types of parameters 'data' and 'data' are incompatible.

            经测试该错误只会在VSCode提示且不影响正常使用
           -->
        </el-card>
      </el-col>

      <!-- 用户数据 -->
      <el-col :span="20">

        <!-- 信息检索 -->
        <el-card style="margin-bottom: 10px;">
          <el-form ref="userQueryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="queryParams.username"
                placeholder="用户名"
                style="width: 200px"
                clearable
                @keyup.enter="handleList"
              />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input
                v-model="queryParams.nickname"
                placeholder="昵称"
                style="width: 200px"
                clearable
                @keyup.enter="handleList"
              />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select
                v-model="queryParams.gender"
                placeholder="性别"
                style="width: 200px"
                clearable
                @keyup.enter="handleList"
              >
                <el-option label="保密" value="保密" />
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
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

        <!-- 用户操作 -->
        <el-card>
          <template #header>
            <el-row class="mb-8">
              <el-button
                type="primary"
                :icon="Plus"
                v-hasPermission="'system:user:add'"
                @click="handleAdd"
              >新增</el-button>
              <el-button
                type="success"
                :icon="Edit"
                :disabled="selectSingle"
                v-hasPermission="'system:user:edit'"
                @click="handleEdit"
              >修改</el-button>
              <el-button
                type="danger"
                :icon="Delete"
                :disabled="selectSingle"
                v-hasPermission="'system:user:delete'"
                @click="handleDelete"
              >删除</el-button>
              <el-button
                type="info"
                :icon="Upload"
              >导入</el-button>
              <el-button
                type="warning"
                :icon="Download"
              >导出</el-button>
            </el-row>
          </template>

          <!-- 用户表格 -->
          <el-table
            v-loading="loading"
            :data="userList"
            @selection-change="handleSelectionChange"
            style="width: 100%"
            align="center"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              label="用户编号"
              prop="userId"
              align="center"
              width="60"
            />
            <el-table-column
              label="部门名称"
              prop="dept.deptName"
              align="center"
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
              width="180"
              align="center"
            />
            <el-table-column
              label="手机号码"
              prop="phone"
              width="90"
              align="center"
            />
            <el-table-column
              label="性别"
              prop="gender"
              align="center"
            >
              <template #default="scope">
                <el-tag>{{ scope.row.gender }}</el-tag>
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
              width="120"
              align="center"
            />
            <el-table-column
              label="创建时间"
              prop="createTime"
              width="160"
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
        <el-form-item v-if="userDialog.type == 'add'" label="密码" prop="password">
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
              :label="item.dataLabel"
            >{{ item.dataValue }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="userForm.roleIds" multiple placeholder="请选择角色">
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
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { ElButton, ElCard, ElCol, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElMessageBox, ElPagination, ElRow, ElTable, ElTableColumn, ElTree, FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Download, Upload, Search, Refresh } from '@element-plus/icons-vue'
import { listUser, addUser, getUser, getRoleSelect, editUser, changeStatus, deleteUser } from '@/api/system/user'
import { deptTree as selectDeptTree } from '@/api/system/dept'
import { SysUser, SysUserForm, SysUserQuery } from '@/api/system/user/types'

const { proxy }: any = getCurrentInstance()
const { sys_user_gender } = proxy.$dict('sys_user_gender')

const state = reactive({
  // 遮罩层
  loading: true,
  // 选中数据
  userId: 0 as number,
  // 选中数据数组
  userIds: [] as number[],
  // 非单个禁用
  selectSingle: true,
  // 部门名称
  deptName: undefined,
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
  userForm: {
    password: '123456',
    gender: '保密'
  } as SysUserForm
})

const {
  loading,
  userIds,
  selectSingle,
  deptName,
  total,
  userList,
  deptTree,
  roleSelect,
  queryParams,
  userDialog,
  userForm
} = toRefs(state)

const deptTreeRef = ref<InstanceType<typeof ElTree>>()
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

// 筛选部门树信息
watch(deptName, (val) => {
  deptTreeRef.value!.filter(val)
})

const filterNode = (value: string, data: TreeSelect) => {
  if (!value) return true
  return data.label.includes(value)
}

// 查询用户列表
function handleList() {
  state.loading = true
  listUser(state.queryParams).then((res:any) => {
    state.userList = res.rows
    state.total = res.total
    state.loading = false
  })
}

// 添加用户信息
function handleAdd() {
  getRoleSelect().then((res: any) => {
    state.roleSelect = res.data
  })

  state.userDialog = {
    title: '新增用户信息',
    type: 'add',
    visible: true
  }
}

// 修改用户信息
function handleEdit() {
  getUser(state.userId).then((res: any) => {
    state.userForm = res.data
  })
  getRoleSelect().then((res: any) => {
    state.roleSelect = res.data
  })

  state.userDialog = {
    title: '修改用户信息',
    type: 'edit',
    visible: true
  }
}

// 删除用户信息
function handleDelete() {
  ElMessageBox.confirm('确认要删除"' + state.userId + '"用户吗?', '警告', {
      type: 'warning'
    }
  ).then(() => {
    deleteUser(state.userId).then(() => {
      ElMessage.success("删除用户信息成功")
      handleList()
    })
  })
}

// 重置表单
function resetQuery() {
  userQueryFormRef.value?.resetFields()
  handleList()
}

// 关闭对话框
function closeUserDialog() {
  state.userDialog.visible = false
  userRuleFormRef.value?.resetFields()
  userRuleFormRef.value?.clearValidate()
}

// 修改用户状态
function handleChangeStatus(row: SysUser) {
  const text = row.status === '0' ? '启用' : '停用';
  ElMessageBox.confirm('确认要' + text + '"' + row.username + '"用户吗?', '警告', {
      type: 'warning'
    }
  ).then(() => {
    return changeStatus(row.userId, row.status)
  }).then(() => {
    ElMessage.success(text + '成功')
  }).catch(() => {
    row.status = row.status === '1' ? '0' : '1'
  })
}

// 多选框
function handleSelectionChange(selection: any) {
  state.userIds = selection.map((item: any) => item.userId)
  state.selectSingle = selection.length !== 1
  if (selection.length === 1) {
    state.userId = userIds.value[0]
  }
}

// 查询部门树
function getDeptTree() {
  selectDeptTree().then (res => {
    state.deptTree = res.data
  })
}

// 部门树节点
function handleDeptNodeClick(data: any ) {
  state.queryParams.deptId = data.value
  handleList()
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (userDialog.value.type == 'add') {
        addUser(state.userForm).then(() => {
          ElMessage.success("添加用户信息成功")
          closeUserDialog()
          handleList()
        })
      }
      if (userDialog.value.type == 'edit') {
        editUser(state.userForm).then(() => {
          ElMessage.success("修改用户信息成功")
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
  getDeptTree()
  handleList()
})
</script>

<style lang="scss" scoped>
</style>
