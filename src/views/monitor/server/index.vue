<template>
  <el-row v-loading="loading">
    <el-col :span="24">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>系统信息</span>
          </div>
        </template>
        <div class="el-table el-table--enable-row-hover el-table--medium">
          <table>
            <thead>
              <th class="el-table__cell is-leaf"><div class="cell">主机名</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">系统名称</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">系统架构</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">系统版本</div></th>
            </thead>
            <tbody>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">{{ os.hostName }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ os.name }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ os.arch }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ os.version }}</div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top: 15px;">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>Java 信息</span>
          </div>
        </template>
        <div class="el-table el-table--enable-row-hover el-table--medium">
          <table>
            <thead>
              <th class="el-table__cell is-leaf"><div class="cell">Java 路径</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">Java 版本</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">Jvm 名称</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">项目路径</div></th>
            </thead>
            <tbody>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">{{ java.javaHome }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ java.javaVersion }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ java.jvmName }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ java.projectHome }}</div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top: 15px;">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>内存信息</span>
          </div>
        </template>
        <div class="el-table el-table--enable-row-hover el-table--medium">
          <table>
            <thead>
              <th class="el-table__cell is-leaf"><div class="cell">总内存</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">已用内存</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">剩余内存</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">内存使用率</div></th>
            </thead>
            <tbody>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">{{ memory.total }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ memory.used }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ memory.free }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ memory.usage }}</div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top: 15px;">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>Jvm 内存信息</span>
          </div>
        </template>
        <div class="el-table el-table--enable-row-hover el-table--medium">
          <table>
            <thead>
              <th class="el-table__cell is-leaf"><div class="cell">总内存</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">已用内存</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">剩余内存</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">内存使用率</div></th>
            </thead>
            <tbody>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">{{ jvmMemory.total }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ jvmMemory.used }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ jvmMemory.free }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ jvmMemory.usage }}</div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top: 15px;">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>CPU 信息</span>
          </div>
        </template>
        <div class="el-table el-table--enable-row-hover el-table--medium">
          <table>
            <thead>
              <th class="el-table__cell is-leaf"><div class="cell">名称</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">核心数</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">总的使用率</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">系统使用率</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">用户使用率</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">当前等待率</div></th>
              <th class="el-table__cell is-leaf"><div class="cell">当前空闲率</div></th>
            </thead>
            <tbody>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">{{ cpu.name }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ cpu.cpuNum }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ cpu.total }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ cpu.sys }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ cpu.user }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ cpu.wait }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ cpu.free }}</div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top: 15px;">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>分区信息</span>
          </div>
        </template>
        <el-table :data="fileStores" style="width: 100%">
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
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
import { getInfo } from '@/api/monitor/server'

const { proxy }: any = getCurrentInstance()

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

const handleList = () => {
  proxy.$message.warning('加载时间较长，请耐心等待...')
  state.loading = true
  getInfo().then((res: any) => {
    state.os = res.data.os
    state.java = res.data.java
    state.memory = res.data.memory
    state.jvmMemory = res.data.jvmMemory
    state.cpu = res.data.cpu
    state.fileStores = res.data.fileStores
    state.loading = false
  })
}

onMounted(() => {
  handleList()
})
</script>

<style lang="scss" scoped>
table {
  border-spacing: 0;
  width: 100%;
}

td, th {
  padding: 0;
}
</style>
