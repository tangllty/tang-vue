<template>
  <div>
    <el-card style="margin-left: 20px;">
      <template #header>
        个人资料
      </template>
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
            disabled
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
            disabled
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
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm(userRuleFormRef, 'userForm')"
          >确 定</el-button>
          <el-button
            type="danger"
            @click="close"
          >关 闭</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-left: 20px; margin-top: 15px;">
      <template #header>
        修改密码
      </template>
      <el-form
        ref="passwordRuleFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="120px"
        status-icon
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            placeholder="请输入旧密码"
            maxlength="32"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            placeholder="请输入新密码"
            maxlength="32"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            placeholder="请输入确认密码"
            maxlength="32"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm(userRuleFormRef, 'passwordForm')"
          >确 定</el-button>
          <el-button
            type="danger"
            @click="close"
          >关 闭</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'
import { editUserInfo, editUserPassword } from '@/api/profile'
import { getRoleSelect as selectRoleSelect } from '@/api/system/user'
import { deptTree as selectDeptTree } from '@/api/system/dept'
import { SysUserForm, SysUserPasswordForm } from '@/api/system/user/types'
import { useUserStore } from '@/store/modules/user'
import router from "@/router";

const userStore = useUserStore()

const { proxy }: any = getCurrentInstance()
const { sys_user_gender, sys_status } = proxy.$dict('sys_user_gender', 'sys_status')

const state = reactive({
  // 部门树数据
  deptTree: [] as TreeSelect[],
  // 角色下拉框数据
  roleSelect: [] as TreeSelect[],
  // 对话框
  userDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  // 个人资料表单
  userForm: {} as SysUserForm,
  // 修改密码表单
  passwordForm: {} as SysUserPasswordForm
})

const {
  deptTree,
  roleSelect,
  userDialog,
  userForm,
  passwordForm
} = toRefs(state)

const userRuleFormRef = ref<FormInstance>()
const passwordRuleFormRef = ref<FormInstance>()
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
  deptId: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
  roleIds: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
})
const passwordRules = reactive<FormRules>({
  oldPassword: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 4, max: 32, message: '密码长度应在 4 到 32 之间', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 4, max: 32, message: '密码长度应在 4 到 32 之间', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 4, max: 32, message: '密码长度应在 4 到 32 之间', trigger: 'blur' },
  ],
})

// 获取用户信息
function handleUserInfo() {
  state.userForm = userStore.user
}

// 查询部门树
function getDeptTree() {
  selectDeptTree().then (res => {
    state.deptTree = res.data
  })
}

// 查询角色下拉框
function getRoleSelect() {
  selectRoleSelect().then (res => {
    state.roleSelect = res.data
  })
}

// 关闭对话框
function close() {
  router.back()
  userRuleFormRef.value?.resetFields()
  userRuleFormRef.value?.clearValidate()
}

const submitForm = async (formEl: FormInstance | undefined, type: string) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(formEl)
      if (type == 'userForm') {
        editUserInfo(state.userForm).then(() => {
          proxy.$message.success("修改个人资料成功")
          resetForm(userRuleFormRef.value)
          handleUserInfo()
        })
      }
      if (type == 'passwordForm') {
        state.passwordForm.userId = userStore.user.userId
        editUserPassword(state.passwordForm).then(() => {
          proxy.$message.success("修改密码成功")
          resetForm(passwordRuleFormRef.value)
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

onMounted(() => {
  handleUserInfo()
  getDeptTree()
  getRoleSelect()
})
</script>

<style lang="scss" scoped>
</style>
