<template>
  <div>
    <el-card>
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="Date" width="120">
          <template #default="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column property="name" label="Name" width="120" />
        <el-table-column property="address" label="Address" show-overflow-tooltip />
      </el-table>
    </el-card>

    <el-card>
      <el-table
        :data="state.userListData"
        style="width: 100%"
      >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        label="用户编号"
        prop="userId"
        align="center"
      />
      <el-table-column
        label="部门编号"
        prop="deptId"
        align="center"
      />
      <el-table-column
        label="用户账号"
        prop="username"
        align="center"
      />
      <el-table-column
        label="昵称"
        prop="nickname"
        align="center"
      />
      <el-table-column
        label="邮箱"
        prop="email"
        width="180"
        align="center"
      />
      <el-table-column
        label="手机号码"
        prop="phone"
        align="center"
      />
      <el-table-column
        label="性别"
        prop="gender"
        align="center"
      />
      <el-table-column
        label="最后登录IP"
        prop="loginIp"
        align="center"
      />
      <el-table-column
        label="最后登录时间"
        prop="loginDate"
        width="120"
        align="center"
      />
      </el-table>
    </el-card>

    <el-card>
      <div style="margin-top: 20px">
        <el-button @click="toggleSelection([tableData[1], tableData[2]])"
          >Toggle selection status of second and third rows</el-button
        >
        <el-button @click="toggleSelection()">Clear selection</el-button>
      </div>
      <el-button type="primary" @click="list()">Primary</el-button>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElTable } from 'element-plus'
import { list as userList } from '@/api/system/user'
import { SysUser } from '@/api/system/user/types'

const state = reactive({
  userListData: [] as SysUser[]
})

function list() {
  userList().then((data:any) => {
    state.userListData = data.data
    console.log(data.data);
    console.log(state.userListData);

  });
}

interface User {
  date: string
  name: string
  address: string
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])
const toggleSelection = (rows?: User[]) => {
  if (rows) {
    rows.forEach((row) => {
      // TODO: improvement typing when refactor table
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      multipleTableRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    multipleTableRef.value!.clearSelection()
  }
}
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  }
]

</script>

<style lang="scss" scoped>
</style>
