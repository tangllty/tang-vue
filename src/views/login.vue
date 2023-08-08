<template>
    <div class="login-container">
      <el-card class="login">
        <template #header>
          <div class="login-header">
            <span>{{ settings.title }}</span>
          </div>
        </template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户名密码" :name="LoginType.USERNAME">
            <el-form
              ref="loginRuleFormRef"
              :model="loginForm"
              status-icon
              :rules="loginRules"
              label-width="120px"
              class="login-form"
            >
              <el-form-item label="用户名" prop="username">
                <el-input
                  v-model="loginForm.username"
                  type="text"
                  autocomplete="off"
                  @keyup.enter="submitForm(loginRuleFormRef)"
                  placeholder="用户名"
                  :prefix-icon="User"
                />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  autocomplete="off"
                  @keyup.enter="submitForm(loginRuleFormRef)"
                  show-password
                  placeholder="密码"
                  :prefix-icon="Lock"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitForm(loginRuleFormRef)"
                >登陆</el-button>
                <el-button
                  @click="resetForm(loginRuleFormRef)"
                >Reset</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="邮箱密码" :name="LoginType.EMAIL">
            <el-form
              ref="loginRuleFormRef"
              :model="loginForm"
              status-icon
              :rules="loginRules"
              label-width="120px"
              class="login-form"
            >
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="loginForm.email"
                  type="text"
                  autocomplete="off"
                  @keyup.enter="submitForm(loginRuleFormRef)"
                  placeholder="用户名"
                  :prefix-icon="Message"
                />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  autocomplete="off"
                  @keyup.enter="submitForm(loginRuleFormRef)"
                  show-password
                  placeholder="密码"
                  :prefix-icon="Lock"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitForm(loginRuleFormRef)"
                >登陆</el-button>
                <el-button
                  @click="resetForm(loginRuleFormRef)"
                >Reset</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import { ElButton, ElForm, ElFormItem, ElInput, ElTabPane, ElTabs, FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { getProxy } from '@/utils/getCurrentInstance'
import { LoginType } from '@/enums'
import { LoginForm } from '@/api/auth/types'
import settings from '@/settings'

const proxy = getProxy()

const userStore = useUserStore()

const state = reactive({
    loginForm: {
      username: 'admin',
      email: 'admin@163.com',
      password: '123456',
      loginType: LoginType.USERNAME
    } as LoginForm,
    activeName: LoginType.USERNAME
})

const {
    loginForm,
    activeName
} = toRefs(state)

const loginRuleFormRef = ref<FormInstance>()
const loginRules = reactive<FormRules>({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 4, max: 32, message: '用户名长度应在 4 到 32 之间', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { min: 6, max: 32, message: '邮箱长度应在 6 到 64 之间', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 4, max: 32, message: '密码长度应在 4 到 32 之间', trigger: 'blur' },
  ],
})

// 切换登陆方式
const handleClick = (tab: TabsPaneContext, event: Event) => {
  state.loginForm.loginType = tab.paneName as LoginType
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    await userStore.login(state.loginForm)
    await proxy.$router.push({ path: '/' })
  } catch (error) {
    console.log('error submit!')
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style lang="scss" scoped>
.login-container {
    display: flex;
    justify-content: center;

  .login {
    width: 520px;
    margin-top: 150px;

    .login-header {
      text-align: center;
      font-size: 18px;
    }

    .login-form {

      .el-input {
        width: 80%;
      }
    }
  }
}
</style>
