<template>
  <div class="loader-container">
    <div class="loader-wrapper">
      <div class="loader">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      <div class="loader-text">正在登录中...</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { getProxy } from '@/utils/getCurrentInstance'
import { setToken } from '@/utils/auth'

const proxy = getProxy()

const userStore = useUserStore()

const handleGitHubLogin = async () => {
  const token = proxy.$route.query.token as string
  if (token) {
    userStore.token = token
    setToken(token)
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
        proxy.$router.push({ path: redirectUrlArr[0], query: redirectUrlParamsObj })
        return
      }
      proxy.$router.push({ path: redirectUrl })
      return
    }
    proxy.$router.push({ path: '/' })
  }
}

onMounted(async () => {
  await handleGitHubLogin()
})
</script>

<style lang="scss" scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .loader-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;

    .loader {
      position: relative;
      width: 64px;
      height: 64px;
      margin: auto;
      animation: rotate 1.4s infinite linear;

      .dot {
        position: absolute;
        width: 16px;
        height: 16px;
        background-color: rgb(71, 170, 252);
        border-radius: 50%;
      }

      .dot:nth-child(1) {
        top: 0;
        left: 0;
      }

      .dot:nth-child(2) {
        top: 0;
        right: 0;
      }

      .dot:nth-child(3) {
        bottom: 0;
        left: 0;
      }

      .dot:nth-child(4) {
        bottom: 0;
        right: 0;
      }
    }

    .loader-text {
      margin-top: 20px;
      font-size: 16px;
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
