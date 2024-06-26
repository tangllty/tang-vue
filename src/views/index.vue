<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <el-row :gutter="20">
              <el-image
                :src="userStore.user.avatar"
                class="user-avatar mr-10"
              />
              <span class="user-info">
                <span class="mr-10">
                  欢迎您：{{ userStore.user.nickname }}
                </span>
                <span class="mr-10">
                  角色：{{ userStore.roleNames.toLocaleString() }}
                </span>
                <span>
                  部门：{{ userStore.user.dept.deptName }}
                </span>
              </span>
            </el-row>
          </template>
          <el-row :gutter="20" class="mb-6">
            <el-col :span="24">
              糖猫猫权限管理系统交流群(点击可放大)：
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-image
                :src="wechat"
                :preview-src-list="groupList"
                :initial-index="0"
              />
            </el-col>
            <el-col :span="8">
              <el-button
                type="primary"
                tag="a"
                href="https://t.me/+xmuCI7eHW902Mzk1"
                target="_blank"
                class="mb-20"
              >点我加入 Telegram</el-button>
              <el-image
                :src="telegram"
                :preview-src-list="groupList"
                :initial-index="1"
              />
            </el-col>
            <el-col :span="8">
              <el-image
                :src="qq"
                :preview-src-list="groupList"
                :initial-index="2"
              />
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header flex flex-justify-between items-center">
              <span>糖猫猫权限管理系统</span>
              <div>
                <el-button
                  tag="a"
                  href="https://github.com/tangllty/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <template #icon>
                    <SvgIcon name="github" />
                  </template>
                  项目源码主页
                </el-button>
                <el-button
                  tag="a"
                  href="https://gitee.com/tangllty/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <template #icon>
                    <SvgIcon name="gitee" />
                  </template>
                  项目源码主页
                </el-button>
              </div>
            </div>
          </template>
          <p>后端：Spring Boot 3 + Spring Security + MyBatis + Redis + Jwt</p>
          <p>前端：Vue 3 + Vite 5 + Vue Router 4 + TypeScript + Pinia + Element Plus</p>
          <p>文档：VitePress + TypeScript</p>
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
import * as echarts from 'echarts'
import { useUserStore } from '@/store/modules/user'
import { listUserVisit } from '@/api/index'

import wechat from '@/assets/wechat.png'
import telegram from '@/assets/telegram.png'
import qq from '@/assets/qq.png'
const groupList = [wechat, telegram, qq]

const userStore = useUserStore()

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

onMounted(async () => {
  await handleUserVisit()
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
