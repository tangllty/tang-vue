<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <el-row :gutter="20">
            <el-col :span="3">
              <el-image :src="userAvatar" style="width: 40px; height: 40px; border-radius: 5px; border: #304156 solid 1px;" />
            </el-col>
            <el-col :span="21">
              <span style="line-height: 42px;">
                <span style="font-size: 22px; margin-right: 10px;">
                  糖猫猫
                </span>
                <span style="margin-right: 10px">
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
    <el-row style="margin-top: 15px;">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>用户访问量</span>
            </div>
          </template>
          <div id="user" style="height: 450px;" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'

import userAvatar from '@/assets/logo.png'

const options = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
}

onMounted(() => {
  const chart = echarts.init(document.getElementById('user') as HTMLDivElement)
  chart.setOption(options)
  window.addEventListener('resize', () => chart.resize())
})
</script>

<style lang="scss" scoped>
</style>
