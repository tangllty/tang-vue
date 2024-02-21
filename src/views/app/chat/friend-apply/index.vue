<template>
  <div>
    <!-- 信息检索 -->
    <el-card class="mb-10">
      <el-form
        ref="appFriendApplyQueryFormRef"
        :model="queryParams"
        inline
      >
        <el-form-item label="申请理由" prop="reason">
          <el-input
            v-model="queryParams.reason"
            placeholder="请输入申请理由"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="申请类型" prop="applyType">
          <el-input
            v-model="queryParams.applyType"
            placeholder="请输入申请类型"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="申请状态" prop="status">
          <el-input
            v-model="queryParams.status"
            placeholder="请输入申请状态"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
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

    <!-- 用户好友申请数据 -->
    <el-card>

      <!-- 用户好友申请操作 -->
      <template #header>
        <el-row>
          <el-button
            type="primary"
            :icon="Plus"
            v-hasPermission="'app:chat:friend-apply:add'"
            @click="handleSearch"
          >添加好友</el-button>
          <el-button
            type="success"
            :icon="Edit"
            :disabled="applyIds.length !== 1"
            v-hasPermission="'system:dict:edit'"
            @click="handleEdit"
          >修改</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="applyIds.length === 0"
            v-hasPermission="'app:chat:friend-apply:delete'"
            @click="handleDeletes"
          >删除</el-button>
        </el-row>
      </template>

      <!-- 用户好友申请表格 -->
      <el-table
        v-loading="loading"
        :data="appFriendApplyList"
        row-key="applyId"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="applyId"
          label="申请ID"
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
          label="昵称"
          align="center"
        />
        <el-table-column
          prop="reason"
          label="申请理由"
          align="center"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
        />
        <el-table-column
          prop="applyType"
          label="申请类型"
          align="center"
          width="100"
        >
          <template #default="scope">
            <dict-tag :data="app_friend_apply_type" :value="scope.row.applyType" />
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="申请状态"
          align="center"
          width="100"
        >
          <template #default="scope">
            <dict-tag :data="app_friend_apply_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
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
              v-if="scope.row.status === '0'"
              v-hasPermission="'app:chat:friend-apply:edit'"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              type="primary"
              link
              :icon="Delete"
              size="small"
              v-hasPermission="'app:chat:friend-apply:delete'"
              @click="handleDelete(scope.row)"
            >删除</el-button>
            <el-button
              type="primary"
              link
              :icon="Check"
              size="small"
              v-if="scope.row.status === '0' && scope.row.requestorId !== userStore.user.userId"
              v-hasPermission="'app:chat:friend-apply:accept'"
              @click="handleAccept(scope.row)"
            >同意</el-button>
            <el-button
              type="primary"
              link
              :icon="Close"
              size="small"
              v-if="scope.row.status === '0' && scope.row.requestorId !== userStore.user.userId"
              v-hasPermission="'app:chat:friend-apply:decline'"
              @click="handleDecline(scope.row)"
            >拒绝</el-button>
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

    <!-- 添加或修改用户好友申请信息对话框 -->
    <el-dialog
      :title="appFriendApplyDialog.title"
      v-model="appFriendApplyDialog.visible"
      @close="closeAppFriendApplyDialog"
    >
      <el-form
        ref="appFriendApplyRuleFormRef"
        :model="appFriendApplyForm"
        :rules="appFriendApplyRules"
        label-width="120px"
        status-icon
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="appFriendApplyForm.userId"
            placeholder="请输入用户ID"
          />
        </el-form-item>
        <el-form-item label="好友ID" prop="friendId">
          <el-input
            v-model="appFriendApplyForm.friendId"
            placeholder="请输入好友ID"
          />
        </el-form-item>
        <el-form-item label="申请理由" prop="reason">
          <el-input
            v-model="appFriendApplyForm.reason"
            placeholder="请输入申请理由"
          />
        </el-form-item>
        <el-form-item label="申请类型" prop="applyType">
          <el-select
            v-model="appFriendApplyForm.applyType"
            placeholder="请选择申请类型"
          >
            <el-option
              v-for="item in app_friend_apply_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请状态" prop="status">
          <el-radio-group v-model="appFriendApplyForm.status">
            <el-radio
              v-for="item in app_friend_apply_status"
              :key="item.value"
              :label="item.value"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创建者" prop="createBy">
          <el-input
            v-model="appFriendApplyForm.createBy"
            placeholder="请输入创建者"
          />
        </el-form-item>
        <el-form-item label="更新者" prop="updateBy">
          <el-input
            v-model="appFriendApplyForm.updateBy"
            placeholder="请输入更新者"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="appFriendApplyForm.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitForm(appFriendApplyRuleFormRef)"
          >确 定</el-button>
          <el-button
            @click="closeAppFriendApplyDialog"
          >取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <SearchFriend ref="searchFriendRef" @submitted="handleList" />
  </div>
</template>

<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Search, Refresh, Check, Close } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { getProxy } from '@/utils/getCurrentInstance'
import { listAppFriendApply, getAppFriendApply, editAppFriendApply, acceptAppFriendApply, declineAppFriendApply, deleteAppFriendApply, deleteAppFriendApplys } from '@/api/app/chat/friend-apply'
import { AppFriendApply, AppFriendApplyForm, AppFriendApplyQuery } from '@/api/app/chat/friend-apply/types'
import SearchFriend from './SearchFriend.vue'

const proxy = getProxy()
const { app_friend_apply_type, app_friend_apply_status } = proxy.$dict('app_friend_apply_type', 'app_friend_apply_status')

const userStore = useUserStore()

const state = reactive({
  // 遮罩层
  loading: false,
  // 选中数据
  applyId: 0 as number,
  // 选中数据数组
  applyIds: [] as number[],
  // 总条数
  total: 0,
  // 用户好友申请数据
  appFriendApplyList: [] as AppFriendApply[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as AppFriendApplyQuery,
  // 用户好友申请对话框
  appFriendApplyDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  // 用户好友申请表单
  appFriendApplyForm: {} as AppFriendApplyForm,
})

const {
  loading,
  applyIds,
  total,
  appFriendApplyList,
  queryParams,
  appFriendApplyDialog,
  appFriendApplyForm
} = toRefs(state)

const searchFriendRef = ref<InstanceType<typeof SearchFriend>>()

const appFriendApplyRuleFormRef = ref<FormInstance>()
const appFriendApplyQueryFormRef = ref<FormInstance>()
const appFriendApplyRules = reactive<FormRules>({
  applyId: [
    { required: true, message: '用户好友申请不能为空', trigger: 'blur' },
  ],
  userId: [
    { required: true, message: '用户好友申请不能为空', trigger: 'blur' },
  ],
  friendId: [
    { required: true, message: '用户好友申请不能为空', trigger: 'blur' },
  ],
  reason: [
    { required: true, message: '用户好友申请不能为空', trigger: 'blur' },
  ],
  applyType: [
    { required: true, message: '用户好友申请不能为空', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '用户好友申请不能为空', trigger: 'blur' },
  ],
  createBy: [
    { required: true, message: '用户好友申请不能为空', trigger: 'blur' },
  ],
  createTime: [
    { required: true, message: '用户好友申请不能为空', trigger: 'blur' },
  ],
  updateBy: [
    { required: true, message: '用户好友申请不能为空', trigger: 'blur' },
  ],
  updateTime: [
    { required: true, message: '用户好友申请不能为空', trigger: 'blur' },
  ],
  remark: [
    { required: true, message: '用户好友申请不能为空', trigger: 'blur' },
  ],
})

// 查询用户好友申请列表
const handleList = async () => {
  state.loading = true
  const res: any = await listAppFriendApply(state.queryParams)
  state.appFriendApplyList = res.rows
  state.total = res.total
  state.loading = false
}

// 搜索用户好友
const handleSearch = () => {
  searchFriendRef.value?.handleSearch()
}

// 修改用户好友申请信息
const handleEdit = async (row: any) => {
  let applyId = state.applyId
  if (row.applyId) {
    applyId = row.applyId
  }
  const res: any = await getAppFriendApply(applyId)
  state.appFriendApplyForm = res.data

  state.appFriendApplyDialog = {
    title: '修改用户好友申请信息',
    type: 'edit',
    visible: true
  }
}

// 同意好友申请
const handleAccept = async (row: any) => {
  try {
    await proxy.$confirm('确认同意"' + row.uniqueId + '"用户好友申请信息吗？', '提示', {
      type: 'warning'
    })
    await acceptAppFriendApply(row.uniqueId)
    proxy.$message.success('同意用户好友申请信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

// 拒绝好友申请
const handleDecline = async (row: any) => {
  try {
    await proxy.$confirm('确认拒绝"' + row.uniqueId + '"用户好友申请信息吗？', '提示', {
      type: 'warning'
    })
    await declineAppFriendApply(row.uniqueId)
    proxy.$message.success('拒绝用户好友申请信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

// 删除用户好友申请信息
const handleDelete = async (row: any) => {
  try {
    await proxy.$confirm('确认删除"' + row.applyId + '"用户好友申请信息吗？', '提示', {
      type: 'warning'
    })
    await deleteAppFriendApply(row.applyId)
    proxy.$message.success('删除用户好友申请信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

// 批量删除用户好友申请信息
const handleDeletes = async () => {
  try {
    await proxy.$confirm('确认删除"' + state.applyIds + '"用户好友申请信息吗？', '提示', {
      type: 'warning'
    })
    await deleteAppFriendApplys(state.applyIds)
    proxy.$message.success('删除用户好友申请信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

// 重置表单
const resetQuery = async () => {
  proxy.$resetForm(appFriendApplyQueryFormRef.value)
  await handleList()
}

// 关闭对话框
const closeAppFriendApplyDialog = () => {
  state.appFriendApplyDialog.visible = false
  proxy.$resetForm(appFriendApplyRuleFormRef.value)
}

// 多选框
const handleSelectionChange = (selection: any) => {
  state.applyIds = selection.map((item: any) => item.applyId)
  if (selection.length === 1) {
    state.applyId = applyIds.value[0]
  }
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    if (appFriendApplyDialog.value.type == 'edit') {
      await editAppFriendApply(state.appFriendApplyForm)
      proxy.$message.success('修改用户好友申请信息成功')
      closeAppFriendApplyDialog()
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
