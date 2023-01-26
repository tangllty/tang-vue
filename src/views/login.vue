<template>
    <div>
        <el-form
            ref="loginRuleFormRef"
            :model="loginForm"
            status-icon
            :rules="loginRules"
            label-width="120px"
            class="demo-ruleForm"
        >
            <el-form-item label="用户名" prop="username">
                <el-input
                    v-model="loginForm.username"
                    type="text"
                    autocomplete="off"
                />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input
                    v-model="loginForm.password"
                    type="password"
                    autocomplete="off"
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
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { LoginForm } from '@/api/auth/types'
import { useUserStore } from "@/store/modules/user"
import router from '@/router';

const userStore = useUserStore()

const state = reactive({
    loginForm: {
      username: 'admin',
      password: '123456',
      loginType: 'username'
    } as LoginForm
})

const {
    loginForm
} = toRefs(state)

const loginRuleFormRef = ref<FormInstance>()
const loginRules = reactive<FormRules>({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 4, max: 32, message: '用户名长度应在 4 到 32 之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 4, max: 32, message: '密码长度应在 4 到 32 之间', trigger: 'blur' },
  ],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      userStore.login(state.loginForm).then(() => {
        router.push({ path: '/' })
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style lang="scss" scoped>
</style>
