<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-card>
          <el-input></el-input>
          部门
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-card style="margin-bottom: 10px;">
          <el-form ref="userQueryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="queryParams.username"
                placeholder="用户名"
                style="width: 200px"
                @keyup.enter="list"
              />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input
                v-model="queryParams.nickname"
                placeholder="昵称"
                style="width: 200px"
                @keyup.enter="list"
              />
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-input
                v-model="queryParams.gender"
                placeholder="性别"
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
        <!-- 用户操作 -->
        <el-card>
          <template #header>
            <el-row class="mb-8">
              <el-button
                type="primary"
                :icon="Plus"
                @click="add()"
              >新增</el-button>
              <el-button
                type="success"
                :icon="Edit"
                :disabled="selectSingle"
                @click="edit()"
              >修改</el-button>
              <el-button
                type="danger"
                :icon="Delete"
                :disabled="selectSingle"
                @click="deleteUser()"
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
          />
          <el-table-column
            label="部门编号"
            prop="deptId"
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
            align="center"
          />
          <el-table-column
            label="性别"
            prop="gender"
            align="center"
          />
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

          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            v-model:current-page="queryParams.pageNum"
            v-model:page-size="queryParams.pageSize"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-card>
      </el-col>
    </el-row>

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
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="userForm.username"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
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
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElTable, FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Download, Upload, Search, Refresh } from '@element-plus/icons-vue'
import { list as getUserList, add as addUser, getUser, edit as editUser, deleteUser as deleteUserByUserId } from '@/api/system/user'
import { SysUser, SysUserForm, SysUserQuery } from '@/api/system/user/types'

const state = reactive({
  loading: true,
  userId: 0 as number,
  userIds: [] as number[],
  selectSingle: true,
  total: 0,
  userList: [] as SysUser[],
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as SysUserQuery,
  userDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  userForm: {
  } as SysUserForm
})

const {
  loading,
  userIds,
  selectSingle,
  total,
  userList,
  queryParams,
  userDialog,
  userForm
} = toRefs(state)

const userRuleFormRef = ref<FormInstance>()
const userQueryFormRef = ref<FormInstance>()
const userRules = reactive<FormRules>({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    { min: 3, max: 32, message: 'Length should be 3 to 32', trigger: 'blur' },
  ],
})

function list() {
  state.loading = true
  getUserList(state.queryParams).then((res:any) => {
    state.userList = res.rows
    state.total = res.total
    state.loading = false
  })
}

const handleSizeChange = (pageSize: number) => {
  state.queryParams.pageSize = pageSize
  list()
}
const handleCurrentChange = (pageNum: number) => {
  state.queryParams.pageNum = pageNum
  list()
}

function add() {
  state.userDialog = {
    title: '新增用户信息',
    type: 'add',
    visible: true
  }
}

function edit() {
  getUser(state.userId).then((res:any) => {
    state.userForm = res.data
  })

  state.userDialog = {
    title: '修改用户信息',
    type: 'edit',
    visible: true
  }
}


function deleteUser() {
  deleteUserByUserId(state.userId).then(() => {
    ElMessage.success("删除用户信息成功")
    list()
  })
}

 function resetQuery() {
  userQueryFormRef.value?.resetFields()
  list()
}

function closeUserDialog() {
  state.userDialog.visible = false
  userRuleFormRef.value?.resetFields()
  userRuleFormRef.value?.clearValidate()
}

function handleSelectionChange(selection: any) {
  state.userIds = selection.map((item: any) => item.userId)
  state.selectSingle = selection.length !== 1
  if (selection.length === 1) {
    state.userId = userIds.value[0]
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (userDialog.value.type == 'add') {
        addUser(state.userForm).then(() => {
          ElMessage.success("添加用户信息成功")
          closeUserDialog()
          list()
        })
      }
      if (userDialog.value.type == 'edit') {
        editUser(state.userForm).then(() => {
          ElMessage.success("修改用户信息成功")
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
