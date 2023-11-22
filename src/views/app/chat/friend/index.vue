<template>
  <div>
    <!-- 信息检索 -->
    <el-card class="mb-10">
      <el-form
        ref="appFriendQueryFormRef"
        :model="queryParams"
        inline
      >
        <el-form-item label="创建者" prop="createBy">
          <el-input
            v-model="queryParams.createBy"
            placeholder="请输入创建者"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="更新者" prop="updateBy">
          <el-input
            v-model="queryParams.updateBy"
            placeholder="请输入更新者"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="queryParams.remark"
            placeholder="请输入备注"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :icon="Search"
            @click="handleList"
          >搜索</el-button>
          <el-button
            :icon="Refresh"
            @click="resetQuery"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户好友数据 -->
    <el-card>

      <!-- 用户好友操作 -->
      <template #header>
        <el-row>
          <el-button
            type="success"
            :icon="Edit"
            :disabled="userFriendIds.length !== 1"
            v-hasPermission="'system:dict:edit'"
            @click="handleEdit"
          >修改</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="userFriendIds.length === 0"
            v-hasPermission="'app:chat:friend:delete'"
            @click="handleDeletes"
          >删除</el-button>
        </el-row>
      </template>

      <!-- 用户好友表格 -->
      <el-table
        v-loading="loading"
        :data="appFriendList"
        row-key="userFriendId"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="userFriendId"
          label="用户好友ID"
          align="center"
        />
        <el-table-column
          prop="userId"
          label="用户ID"
          align="center"
        />
        <el-table-column
          prop="friendId"
          label="好友ID"
          align="center"
        />
        <el-table-column
          prop="username"
          label="用户名"
          align="center"
        />
        <el-table-column
          prop="nickname"
          label="好友昵称"
          align="center"
        />
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
          align="center"
        />
        <el-table-column
          label="操作"
          width="190"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="primary"
              link
              :icon="Edit"
              size="small"
              v-hasPermission="'app:chat:friend:edit'"
              @click="handleInitChat(scope.row)"
            >发起聊天</el-button>
            <el-button
              type="primary"
              link
              :icon="Edit"
              size="small"
              v-hasPermission="'app:chat:friend:edit'"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              type="primary"
              link
              :icon="Delete"
              size="small"
              v-hasPermission="'app:chat:friend:delete'"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination
        v-if="total > 0"
        :total="total"
        v-model:pageNum="queryParams.pageNum"
        v-model:pageSize="queryParams.pageSize"
        @pagination="handleList"
      />
    </el-card>

    <!-- 添加或修改用户好友信息对话框 -->
    <el-dialog
      :title="appFriendDialog.title"
      v-model="appFriendDialog.visible"
      @close="closeAppFriendDialog"
    >
      <el-form
        ref="appFriendRuleFormRef"
        :model="appFriendForm"
        :rules="appFriendRules"
        label-width="120px"
        status-icon
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="appFriendForm.userId"
            placeholder="请输入用户ID"
            disabled
          />
        </el-form-item>
        <el-form-item label="好友ID" prop="friendId">
          <el-input
            v-model="appFriendForm.friendId"
            placeholder="请输入好友ID"
            disabled
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="appFriendForm.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitForm(appFriendRuleFormRef)"
          >确 定</el-button>
          <el-button
            @click="closeAppFriendDialog"
          >取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { listAppFriend, getAppFriend, editAppFriend, deleteAppFriend, deleteAppFriends } from '@/api/app/chat/friend'
import { AppFriend, AppFriendForm, AppFriendQuery } from '@/api/app/chat/friend/types'
import { listAppChatListAll, addAppChatList } from '@/api/app/chat/chat-list'
import { AppChatListForm } from '@/api/app/chat/chat-list/types'

const proxy = getProxy()

const state = reactive({
  // 遮罩层
  loading: false,
  // 选中数据
  userFriendId: 0 as number,
  // 选中数据数组
  userFriendIds: [] as number[],
  // 总条数
  total: 0,
  // 用户好友数据
  appFriendList: [] as AppFriend[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as AppFriendQuery,
  // 用户好友对话框
  appFriendDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  // 用户好友表单
  appFriendForm: {} as AppFriendForm
})

const {
  loading,
  userFriendIds,
  total,
  appFriendList,
  queryParams,
  appFriendDialog,
  appFriendForm
} = toRefs(state)

const appFriendRuleFormRef = ref<FormInstance>()
const appFriendQueryFormRef = ref<FormInstance>()
const appFriendRules = reactive<FormRules>({
  userFriendId: [
    { required: true, message: '用户好友不能为空', trigger: 'blur' },
  ],
  userId: [
    { required: true, message: '用户好友不能为空', trigger: 'blur' },
  ],
  friendId: [
    { required: true, message: '用户好友不能为空', trigger: 'blur' },
  ],
  nickName: [
    { required: true, message: '用户好友不能为空', trigger: 'blur' },
  ],
  createBy: [
    { required: true, message: '用户好友不能为空', trigger: 'blur' },
  ],
  createTime: [
    { required: true, message: '用户好友不能为空', trigger: 'blur' },
  ],
  updateBy: [
    { required: true, message: '用户好友不能为空', trigger: 'blur' },
  ],
  updateTime: [
    { required: true, message: '用户好友不能为空', trigger: 'blur' },
  ],
  remark: [
    { required: true, message: '用户好友不能为空', trigger: 'blur' },
  ],
})

// 查询用户好友列表
const handleList = async () => {
  state.loading = true
  const res: any = await listAppFriend(state.queryParams)
  state.appFriendList = res.rows
  state.total = res.total
  state.loading = false
}

// 发起聊天
const handleInitChat= async (row: any) => {
  const res: any = await listAppChatListAll()
  const chatList = res.data
  const existed = chatList.some((item: any) => item.friendId === row.friendId)
  if (existed) {
    handleGoChatRoom(row)
  } else {
    const appChatListForm = {
      chatListId: row.uniqueId,
      userId: row.userId,
      friendId: row.friendId
    } as AppChatListForm
    await addAppChatList(appChatListForm)
    handleGoChatRoom(row)
  }
}

// 前往聊天室
const handleGoChatRoom = async (row: any) => {
  proxy.$router.push({
    path: '/app/chat/room',
    query: {
      friendId: row.friendId
    }
  })
}

// 修改用户好友信息
const handleEdit = async (row: any) => {
  let userFriendId = state.userFriendId
  if (row.userFriendId) {
    userFriendId = row.userFriendId
  }
  const res: any = await getAppFriend(userFriendId)
  state.appFriendForm = res.data

  state.appFriendDialog = {
    title: '修改用户好友信息',
    type: 'edit',
    visible: true
  }
}

// 删除用户好友信息
const handleDelete = async (row: any) => {
  try {
    await proxy.$confirm('确认删除"' + row.userFriendId + '"用户好友信息吗？', '提示', {
      type: 'warning'
    })
    await deleteAppFriend(row.userFriendId)
    proxy.$message.success('删除用户好友信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

// 批量删除用户好友信息
const handleDeletes = async () => {
  try {
    await proxy.$confirm('确认删除"' + state.userFriendIds + '"用户好友信息吗？', '提示', {
      type: 'warning'
    })
    await deleteAppFriends(state.userFriendIds)
    proxy.$message.success('删除用户好友信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

// 重置表单
const resetQuery = async () => {
  appFriendQueryFormRef.value?.resetFields()
  await handleList()
}

// 关闭对话框
const closeAppFriendDialog = () => {
  state.appFriendDialog.visible = false
  appFriendRuleFormRef.value?.clearValidate()
  appFriendRuleFormRef.value?.resetFields()
}

// 多选框
const handleSelectionChange = (selection: any) => {
  state.userFriendIds = selection.map((item: any) => item.userFriendId)
  if (selection.length === 1) {
    state.userFriendId = userFriendIds.value[0]
  }
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    if (appFriendDialog.value.type == 'edit') {
      await editAppFriend(state.appFriendForm)
      proxy.$message.success('修改用户好友信息成功')
      closeAppFriendDialog()
      await handleList()
    }
  } catch (error) {
    console.log('error submit!', error)
  }
}

onMounted(async () => {
  await handleList()
})
</script>

<style lang="scss" scoped>
</style>
