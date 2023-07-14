<template>
  <div>
    <el-timeline>
      <el-timeline-item
        v-for="item in sysLogLoginList"
        :key="item.loginId"
        :timestamp="item.loginTime.toString()"
      >
        <el-row>
          登陆账号：{{ item.account }}（{{ item.loginType }}）
        </el-row>
        <el-row>
          <el-col :span="4">
            {{ item.location }} | {{ item.ip }}
          </el-col>
          <el-col :span="4">
            {{ item.os }} | {{ item.browser }}
          </el-col>
          <el-col :span="4">
            <el-tag :type="item.success === '成功' ? 'success' : 'danger'">{{ item.success }} | {{ item.message }}</el-tag>
          </el-col>
        </el-row>
      </el-timeline-item>
    </el-timeline>

    <!-- 分页 -->
    <pagination
      v-if="total > 0"
      :total="total"
      v-model:pageNum="queryParams.pageNum"
      v-model:pageSize="queryParams.pageSize"
      @pagination="handleList"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { FormInstance } from 'element-plus'
import { listSysLogLoginByUser } from '@/api/profile'
import { SysLogLogin, SysLogLoginQuery } from '@/api/system/log/login/types'

const state = reactive({
  // 遮罩层
  loading: false,
  // 选中数据
  loginId: 0 as number,
  // 选中数据数组
  loginIds: [] as number[],
  // 总条数
  total: 0,
  // 登陆日志数据
  sysLogLoginList: [] as SysLogLogin[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as SysLogLoginQuery
})

const {
  loading,
  loginIds,
  total,
  sysLogLoginList,
  queryParams
} = toRefs(state)

const sysLogLoginQueryFormRef = ref<FormInstance>()

const handleList = async () => {
  const res: any = await listSysLogLoginByUser(state.queryParams)
  state.sysLogLoginList = res.rows
  state.total = res.total
}

onMounted( async () => {
  await handleList()
})
</script>

<style lang="scss" scoped>
</style>
