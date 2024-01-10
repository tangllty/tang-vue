<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <el-row :gutter="20">
            <el-col :span="3">
              <el-image :src="userAvatar" class="user-avatar" />
            </el-col>
            <el-col :span="21">
              <span class="user-info">
                <span class="mr-10">
                  糖猫猫
                </span>
                <span class="mr-10">
                  系统管理员
                </span>
                <span>
                  研发一组
                </span>
              </span>
            </el-col>
          </el-row>
          <br />
          <el-skeleton :rows="4" animated />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <el-skeleton :rows="6" animated />
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
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import { listUserVisit } from '@/api/index'

import userAvatar from '@/assets/logo.png'

const options = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  }
}

onMounted(async () => {
  const res = await listUserVisit()
  const chart = echarts.init(document.getElementById('userVisit') as HTMLDivElement)
  chart.setOption({
    ...options,
    series: [
      {
        data: res.data,
        type: 'line'
      }
    ]
  })
  window.addEventListener('resize', () => chart.resize())
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
