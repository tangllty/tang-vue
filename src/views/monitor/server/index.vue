<template>
  <el-row v-loading="loading">
    <el-col :span="24">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>系统信息</span>
          </div>
        </template>
        <el-table :data="[os]">
          <el-table-column prop="hostName" label="主机名" />
          <el-table-column prop="name" label="系统名称" />
          <el-table-column prop="arch" label="系统架构" />
          <el-table-column prop="version" label="系统版本" />
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="24" class="mt-15">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>Java 信息</span>
          </div>
        </template>
        <el-table :data="[java]">
          <el-table-column
            prop="javaHome"
            label="Java 路径"
            show-overflow-tooltip
          />
          <el-table-column prop="javaVersion" label="Java 版本" />
          <el-table-column prop="jvmName" label="Jvm 名称" />
          <el-table-column
            prop="projectHome"
            label="项目路径"
            show-overflow-tooltip
          />
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="24" class="mt-15">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>内存信息</span>
          </div>
        </template>
        <el-table :data="[memory]">
          <el-table-column prop="total" label="总内存" />
          <el-table-column prop="used" label="已用内存" />
          <el-table-column prop="free" label="剩余内存" />
          <el-table-column prop="usage" label="内存使用率" />
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="24" class="mt-15">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>Jvm 内存信息</span>
          </div>
        </template>
        <el-table :data="[jvmMemory]">
          <el-table-column prop="total" label="总内存" />
          <el-table-column prop="used" label="已用内存" />
          <el-table-column prop="free" label="剩余内存" />
          <el-table-column prop="usage" label="内存使用率" />
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="24" class="mt-15">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>CPU 信息</span>
          </div>
        </template>
        <el-table :data="[cpu]">
          <el-table-column
            prop="name"
            label="名称"
            width="320"
          />
          <el-table-column prop="cpuNum" label="核心数" />
          <el-table-column prop="total" label="总的使用率" />
          <el-table-column prop="sys" label="系统使用率" />
          <el-table-column prop="user" label="用户使用率" />
          <el-table-column prop="wait" label="当前等待率" />
          <el-table-column prop="free" label="当前空闲率" />
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="24" class="mt-15">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>分区信息</span>
          </div>
        </template>
        <el-table :data="fileStores">
          <el-table-column prop="name" label="分区名" />
          <el-table-column prop="type" label="文件系统" />
          <el-table-column prop="mountPoint" label="挂载点" />
          <el-table-column prop="total" label="总大小" />
          <el-table-column prop="used" label="已用大小" />
          <el-table-column prop="free" label="剩余大小" />
          <el-table-column prop="usage" label="资源利用率" />
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { onMounted, reactive, toRefs } from 'vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { getInfo } from '@/api/monitor/server'

const proxy = getProxy()

const state = reactive({
  loading: false,
  // 系统信息
  os: {} as any,
  // Java 信息
  java: {} as any,
  // 内存信息
  memory: {} as any,
  // JVM 内存信息
  jvmMemory: {} as any,
  // CPU 信息
  cpu: {} as any,
  // 分区信息
  fileStores: [] as any[]
})

const {
  loading,
  os,
  java,
  memory,
  jvmMemory,
  cpu,
  fileStores
} = toRefs(state)

const handleList = async () => {
  proxy.$message.warning('加载时间较长，请耐心等待...')
  state.loading = true
  const res: any = await getInfo()
  state.os = res.data.os
  state.java = res.data.java
  state.memory = res.data.memory
  state.jvmMemory = res.data.jvmMemory
  state.cpu = res.data.cpu
  state.fileStores = res.data.fileStores
  state.loading = false
}

onMounted(async () => {
  await handleList()
})
</script>

<style lang="scss" scoped>
.card-header {
  font-weight: bold;
}
</style>
