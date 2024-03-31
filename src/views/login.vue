<template>
  <div class="login-container">
    <el-card class="login">
      <template #header>
        <div class="login-header">
          <span>{{ $t('login.title') }}</span>
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
                  v-loading="captchaLoading"
                  :src="captchaUrl"
                  @click="handleCaptcha"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                @click="submitForm(loginRuleFormRef)"
              >{{ $t('login.submit') }}</el-button>
              <el-button
                @click="resetForm"
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
                  v-loading="captchaLoading"
                  :src="captchaUrl"
                  @click="handleCaptcha"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                @click="submitForm(loginRuleFormRef)"
              >{{ $t('login.submit') }}</el-button>
              <el-button
                @click="resetForm"
              >{{ $t('login.reset') }}</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-divider>{{ $t('login.otherLogin.title') }}</el-divider>
        <el-button
          type="primary"
          @click="handleGitHubLogin"
        >{{ $t('login.otherLogin.github') }}</el-button>
      </el-tabs>
    </el-card>

    <div class="background-source">
      <el-text>{{ $t('login.backgroundSource') }}</el-text>
      <el-link
        type="primary"
        href="https://wallhaven.cc/w/d62ge3"
        target="_blank"
      >Wallhaven</el-link>
    </div>

    <Snowflake />
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules, TabsPaneContext } from 'element-plus'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { getProxy } from '@/utils/getCurrentInstance'
import { LoginType } from '@/enums'
import { setToken } from '@/utils/auth'
import { getCaptcha } from '@/api/auth'
import type { LoginForm, CaptchaForm } from '@/api/auth/types'

const proxy = getProxy()

const userStore = useUserStore()

const state = reactive({
  loading: false,
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
  captchaLoading: false,
  captchaUrl: ''
})

const {
  loading,
  loginForm,
  activeName,
  captchaLoading,
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
  try {
    state.captchaLoading = true
    const res = await getCaptcha()
    state.loginForm.captcha.id = res.data.id
    state.captchaUrl = `data:image/png;base64,${res.data.text}`
    state.captchaLoading = false
  } catch (error: any) {
    state.captchaLoading = false
    console.log('error get captcha!', error)
  }
}

// GitHub 登录
const handleGitHubLogin = () => {
  proxy.$notImplemented()
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
    state.loading = true
    await userStore.login(state.loginForm)
    const redirectUrl = proxy.$route.query.redirect as string
    if (redirectUrl) {
      const redirectUrlArr: string[] = redirectUrl.split('?')
      if (redirectUrlArr.length > 1) {
        const redirectUrlParams: string[] = redirectUrlArr[1].split('&')
        const redirectUrlParamsObj: { [key: string]: string } = {}
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
    state.loading = false
    if (error.message === '验证码错误' || error.message === '验证码已过期') {
      handleCaptcha()
      state.loginForm.captcha.id = 0
      state.loginForm.captcha.text = ''
    }
    console.log('error submit!')
  }
}

const resetForm = () => {
  proxy.$resetForm(loginRuleFormRef.value)
}

onMounted(async () => {
  await handleCaptcha()
  const token = proxy.$route.query.token as string
  console.log(token)
  if (token) {
    userStore.token = token
    setToken(token)
    proxy.$router.push({ path: '/' })
  }
})
</script>

<style lang="scss" scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url('../assets/login-background.png');
    background-size: cover;

  .login {
    width: 520px;
    z-index: 999;

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

  .background-source {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 999;

    .el-text {
      color: #fff;
      font-size: 12px;
    }
  }
}
</style>
