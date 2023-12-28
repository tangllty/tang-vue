<template>
  <div>
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
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="appFriendApplyForm.username"
            disabled
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="appFriendApplyForm.nickname"
            disabled
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="appFriendApplyForm.email"
            disabled
          />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="appFriendApplyForm.phone"
            disabled
          />
        </el-form-item>
        <el-form-item label="申请理由" prop="reason">
          <el-input
            v-model="appFriendApplyForm.reason"
            placeholder="请输入申请理由"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="appFriendApplyForm.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
        <el-form-item label="申请类型" prop="applyType">
          <el-select
            v-model="appFriendApplyForm.applyType"
            placeholder="请选择申请类型{0=申请添加好友, 1=申请添加群组}"
          >
            <el-option
              v-for="item in app_friend_apply_type"
              :key="item.dataValue"
              :label="item.dataLabel"
              :value="item.dataValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请状态" prop="status">
          <el-radio-group v-model="appFriendApplyForm.status">
            <el-radio
              v-for="item in app_friend_apply_status"
              :key="item.dataValue"
              :label="item.dataValue"
            >{{ item.dataLabel }}</el-radio>
          </el-radio-group>
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
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { getProxy } from '@/utils/getCurrentInstance'
import { addAppFriendApply, editAppFriendApply } from '@/api/app/chat/friend-apply'
import type { AppFriendApplyForm } from '@/api/app/chat/friend-apply/types'
import { getUser } from '@/api/system/user'

const userStore = useUserStore()

const proxy = getProxy()
const { app_friend_apply_type, app_friend_apply_status } = proxy.$dict('app_friend_apply_type', 'app_friend_apply_status')

const state = reactive({
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
  appFriendApplyDialog,
  appFriendApplyForm
} = toRefs(state)

const appFriendApplyRuleFormRef = ref<FormInstance>()
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

// 打开用户好友申请对话框
const handleRequest = async (row: any) => {
  state.appFriendApplyForm.userId = userStore.user.userId
  state.appFriendApplyForm.friendId = row.userId
  state.appFriendApplyForm.applyType = '0'
  state.appFriendApplyForm.status = '0'

  const res: any = await getUser(row.userId)
  const { username, nickname, email, phone } = res.data
  state.appFriendApplyForm.username = username
  state.appFriendApplyForm.nickname = nickname
  state.appFriendApplyForm.email = email
  state.appFriendApplyForm.phone = phone

  state.appFriendApplyDialog = {
    title: '用户好友申请',
    type: 'add',
    visible: true
  }
}

// 关闭对话框
const closeAppFriendApplyDialog = () => {
  state.appFriendApplyDialog.visible = false
  proxy.$resetForm(appFriendApplyRuleFormRef.value)
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    if (appFriendApplyDialog.value.type == 'add') {
      await addAppFriendApply(state.appFriendApplyForm)
      proxy.$message.success('添加用户好友申请信息成功')
      closeAppFriendApplyDialog()
      proxy.$emit('submitted')
    }
    if (appFriendApplyDialog.value.type == 'edit') {
      await editAppFriendApply(state.appFriendApplyForm)
      proxy.$message.success('修改用户好友申请信息成功')
      closeAppFriendApplyDialog()
    }
  } catch (error) {
    console.log('error submit!', error)
  }
}

defineExpose({
  handleRequest
})
</script>

<style lang="scss" scoped>
</style>
