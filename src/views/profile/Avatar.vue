<template>
  <el-image
    :src="userStore.user.avatar"
    class="user-avatar"
    @click="openAvatarDialog"
  />

  <el-dialog
    :title="avatarDialog.title"
    v-model="avatarDialog.visible"
    @close="closeAvatarDialog"
  >
    <div class="avatar-dialog">
      <el-upload
        action=""
        :show-file-list="false"
        :on-change="handleAvatarChange"
        :auto-upload="false"
        class="avatar-uploader"
      >
        <el-icon v-if="!imageUrl" class="avatar-icon">
          <Plus />
        </el-icon>
        <img v-else :src="imageUrl" class="avatar-image" />
      </el-upload>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          @click="submitUpload"
        >确 定</el-button>
        <el-button
          @click="closeAvatarDialog"
        >取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive, toRefs } from 'vue'
import type { UploadProps, UploadFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { editUserAvatar } from '@/api/profile'

const userStore = useUserStore()

const { proxy }: any = getCurrentInstance()

const state = reactive({
  imageUrl: '' as string,
  imageFile: {} as UploadFile,
  // 上传头像对话框
  avatarDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog
})

const {
  imageUrl,
  avatarDialog,
} = toRefs(state)

// 打开用户头像上传对话框
const openAvatarDialog = () => {
  state.avatarDialog = {
    title: '用户头像上传',
    type: 'avatar',
    visible: true
  }
}

// 关闭上传头像对话框
const closeAvatarDialog = () => {
  avatarDialog.value.visible = false
  state.imageUrl = ''
  state.imageFile = {} as UploadFile
}

// 头像上传 onChange 事件
const handleAvatarChange: UploadProps['onChange'] = (uploadFile: UploadFile) => {
  if (uploadFile.raw?.type !== 'image/png') {
    proxy.$message.error('头像文件只能是 png 格式!')
    return
  } else if (uploadFile.raw.size / 1024 / 1024 > 2) {
    proxy.$message.error('头像文件大小不能超过 2MB!')
    return
  }

  state.imageUrl = URL.createObjectURL(uploadFile.raw!)
  state.imageFile = uploadFile
}

// 提交头像上传
const submitUpload = () => {
  editUserAvatar(state.imageFile).then(() => {
    proxy.$message.success('头像上传成功!')
    closeAvatarDialog()
  })
}
</script>

<style lang="scss" scoped>
.user-avatar {
  width: 60px;
  border-radius: 12%;
  border: 1px solid #cccccc;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 10px #cccccc;
    transition: all 0.3s;
  }
}

.avatar-dialog {
  .avatar-uploader {
    width: 320px;
    height: 320px;
    border: 1px dashed var(--el-border-color);
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }

    .avatar-icon {
      font-size: 28px;
      color: #8c939d;
      width: 320px;
      height: 320px;
      text-align: center;
    }

    .avatar-image {
      width: 320px;
      height: 320px;
    }
  }
}
</style>
