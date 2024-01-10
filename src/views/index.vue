<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <el-row :gutter="20">
              <el-col :span="3">
                <el-image :src="userAvatar" class="user-avatar" />
              </el-col>
              <el-col :span="21">
                <span class="user-info">
                  <span class="mr-10">
                    {{ userStore.user.nickname }}
                  </span>
                  <span class="mr-10">
                    {{ userStore.roleNames.toLocaleString() }}
                  </span>
                  <span>
                    {{ userStore.user.dept.deptName }}
                  </span>
                </span>
              </el-col>
            </el-row>
          </template>
          <el-row :gutter="20">
            <el-col :span="24">
              微信群：
              <el-alert
                title="考虑到网络原因，提供 Gitee 和 Github 两个平台的微信群二维码。"
                type="warning"
                show-icon
                class="mt-10 mb-10"
              />
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-image :src="weChatGroupGitee" />
            </el-col>
            <el-col :span="12">
              <el-image :src="weChatGroupGithub" />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>糖猫猫权限管理系统</span>
            </div>
          </template>
          <!-- <el-skeleton :rows="6" animated /> -->
        </el-card>
      </el-col>
    </el-row>
    <el-row class="mt-15">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>用户访问量</span>
            </div>
          </template>
          <div id="userVisit" class="user-visit" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, toRefs } from 'vue'
import * as echarts from 'echarts'
import { useUserStore } from '@/store/modules/user'
import { listUserVisit, getWechatGitee, getWechatGithub } from '@/api/index'

import userAvatar from '@/assets/logo.png'

const userStore = useUserStore()

const state = reactive({
  weChatGroupGitee: '',
  weChatGroupGithub: '',
})

const {
  weChatGroupGitee,
  weChatGroupGithub,
} = toRefs(state)

const userVisitOptions = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  }
}

/**
 * 用户访问量
 */
const handleUserVisit = async () => {
  const res = await listUserVisit()
  const chart = echarts.init(document.getElementById('userVisit') as HTMLDivElement)
  chart.setOption({
    ...userVisitOptions,
    series: [
      {
        data: res.data,
        type: 'line'
      }
    ]
  })
  window.addEventListener('resize', () => chart.resize())
}

/**
 * 请求微信群二维码(Gitee)
 */
const handleRequestGitee = async () => {
  const res: any = await getWechatGitee()
  const blob = new Blob([res.data], { type: 'image/png' })
  state.weChatGroupGitee = URL.createObjectURL(blob)
}

/**
 * 请求微信群二维码(Github)
 */
const handleRequestGithub = async () => {
  const res: any = await getWechatGithub()
  const blob = new Blob([res.data], { type: 'image/png' })
  state.weChatGroupGithub = URL.createObjectURL(blob)
}

onMounted(async () => {
  await handleUserVisit()
  await handleRequestGitee()
  await handleRequestGithub()
})
</script>

<style lang="scss" scoped>
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border: #304156 solid 1px;
}

.user-info {
  line-height: 42px;

  &:first-child {
    font-size: 22px;
  }
}

.user-visit {
  height: 450px;
}
</style>
