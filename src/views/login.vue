<template>
    <div class="login-container">
      <el-card class="login">
        <template #header>
          <div class="login-header">
            <span>{{ settings.loginTitle }}</span>
          </div>
        </template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('login.loginType.username')" :name="LoginType.USERNAME">
            <el-form
              ref="loginRuleFormRef"
              :model="loginForm"
              status-icon
              :rules="loginRules"
              label-width="120px"
              class="login-form"
            >
              <el-form-item :label="$t('login.username')" prop="username">
                <el-input
                  v-model="loginForm.username"
                  type="text"
                  autocomplete="off"
                  @keyup.enter="submitForm(loginRuleFormRef)"
                  :placeholder="$t('login.usernamePlaceholder')"
                  :prefix-icon="User"
                />
              </el-form-item>
              <el-form-item :label="$t('login.password')" prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  autocomplete="off"
                  @keyup.enter="submitForm(loginRuleFormRef)"
                  show-password
                  :placeholder="$t('login.passwordPlaceholder')"
                  :prefix-icon="Lock"
                />
              </el-form-item>
              <el-form-item :label="$t('login.captcha')" prop="captcha">
                <el-input
                  v-model="loginForm.captcha.text"
                  type="text"
                  autocomplete="off"
                  @keyup.enter="submitForm(loginRuleFormRef)"
                  :placeholder="$t('login.captchaPlaceholder')"
                  :prefix-icon="Message"
                  style="width: 50%;"
                />
                <div style="width: 24%; margin-left: 20px; height: 31px">
                  <el-image
                    v-loading="loading"
                    :src="captchaUrl"
                    @click="handleCaptcha"
                  />
                </div>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitForm(loginRuleFormRef)"
                >{{ $t('login.submit') }}</el-button>
                <el-button
                  @click="resetForm(loginRuleFormRef)"
                >{{ $t('login.reset') }}</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :label="$t('login.email')" :name="LoginType.EMAIL">
            <el-form
              ref="loginRuleFormRef"
              :model="loginForm"
              status-icon
              :rules="loginRules"
              label-width="120px"
              class="login-form"
            >
              <el-form-item :label="$t('login.email')" prop="email">
                <el-input
                  v-model="loginForm.email"
                  type="text"
                  autocomplete="off"
                  @keyup.enter="submitForm(loginRuleFormRef)"
                  :placeholder="$t('login.emailPlaceholder')"
                  :prefix-icon="Message"
                />
              </el-form-item>
              <el-form-item :label="$t('login.password')" prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  autocomplete="off"
                  @keyup.enter="submitForm(loginRuleFormRef)"
                  show-password
                  :placeholder="$t('login.passwordPlaceholder')"
                  :prefix-icon="Lock"
                />
              </el-form-item>
              <el-form-item :label="$t('login.captcha')" prop="captcha">
                <el-input
                  v-model="loginForm.captcha.text"
                  type="text"
                  autocomplete="off"
                  @keyup.enter="submitForm(loginRuleFormRef)"
                  :placeholder="$t('login.captchaPlaceholder')"
                  :prefix-icon="Message"
                  style="width: 50%;"
                />
                <div style="width: 24%; margin-left: 20px; height: 31px">
                  <el-image
                    v-loading="loading"
                    :src="captchaUrl"
                    @click="handleCaptcha"
                  />
                </div>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitForm(loginRuleFormRef)"
                >{{ $t('login.submit') }}</el-button>
                <el-button
                  @click="resetForm(loginRuleFormRef)"
                >{{ $t('login.reset') }}</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-divider>其他登录方式</el-divider>
          <el-button
            type="primary"
            @click="handleGitHubLogin"
          >GitHub 授权码</el-button>
        </el-tabs>
      </el-card>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElButton, ElForm, ElFormItem, ElInput, ElTabPane, ElTabs, FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { getProxy } from '@/utils/getCurrentInstance'
import { LoginType } from '@/enums'
import { getCaptcha } from '@/api/auth'
import { LoginForm, CaptchaForm } from '@/api/auth/types'
import settings from '@/settings'

const proxy = getProxy()

const userStore = useUserStore()

const state = reactive({
  loginForm: {
    username: 'admin',
    email: 'admin@163.com',
    password: '123456',
    loginType: LoginType.USERNAME,
    captcha: {
      id: 0,
      text: ''
    } as CaptchaForm
  } as LoginForm,
  activeName: LoginType.USERNAME,
  loading: false,
  captchaUrl: ''
})

const {
  loginForm,
  activeName,
  loading,
  captchaUrl
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
  handleCaptcha()
}

// 获取验证码
const handleCaptcha = async () => {
  state.loading = true
  const res = await getCaptcha()
  state.loginForm.captcha.id = res.data.id
  state.captchaUrl = `data:image/png;base64,${res.data.text}`
  state.loading = false
}

// GitHub 登录
const handleGitHubLogin = () => {
  const clientID = 'Iv1.49e0be67d53b2007'
  const authorize_uri = 'https://github.com/login/oauth/authorize'
  const redirect_uri = 'http://localhost:8080/third-party/oauth/github/redirect'
  window.location.href = `${authorize_uri}?client_id=${clientID}&redirect_uri=${redirect_uri}`
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    await userStore.login(state.loginForm)
    const redirectUrl = proxy.$route.query.redirect as string
    if (redirectUrl) {
      const redirectUrlArr: string[] = redirectUrl.split('?')
      if (redirectUrlArr.length > 1) {
        const redirectUrlParams: string[] = redirectUrlArr[1].split('&')
        const redirectUrlParamsObj: any = {}
        redirectUrlParams.forEach((item: string) => {
          const itemArr: string[] = item.split('=')
          redirectUrlParamsObj[itemArr[0]] = itemArr[1]
        })
        await proxy.$router.push({ path: redirectUrlArr[0], query: redirectUrlParamsObj })
        return
      }
      await proxy.$router.push({ path: redirectUrl })
      return
    }
    await proxy.$router.push({ path: '/' })
  } catch (error: any) {
    if (error.message === '验证码错误' || error.message === '验证码已过期') {
      handleCaptcha()
    }
    console.log('error submit!')
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

onMounted(() => {
  handleCaptcha()
})
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
