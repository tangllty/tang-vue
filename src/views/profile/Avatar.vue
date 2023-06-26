<template>
  <el-image
    :src="userStore.user.avatar"
    class="user-avatar"
    @click="openAvatarDialog"
  />

  <el-dialog
    :title="avatarDialog.title"
    v-model="avatarDialog.visible"
    width="60%"
    @close="closeAvatarDialog"
  >
    <div class="avatar-dialog">
      <Cropper
        ref="cropperRef"
        :src="imageUrl"
        :stencil-props="{
          aspectRatio: 1
        }"
        :resize-image="{
          adjustStencil: false
        }"
        :stencil-size="{
          width: 240,
          height: 240
        }"
        image-restriction="stencil"
        auto-zoom
        @change="handleCropperChange"
        class="cropper"
      />

      <Preview
        :width="240"
        :height="240"
        :image="result.image"
        :coordinates="result.coordinates"
        class="preview"
      />

      <el-upload
        ref="uploadRef"
        action=""
        :show-file-list="false"
        :on-change="handleAvatarChange"
        :auto-upload="false"
        class="avatar-uploader"
      >
        <template #trigger>
          <el-button type="primary">
            选择图片
            <el-icon class="el-icon--right"><Upload /></el-icon>
          </el-button>
        </template>

        <el-button
          :icon="Plus"
          size="small"
          circle
          @click="increaseZoom"
          style="margin-left: 10px;"
        />
        <el-button
          :icon="Minus"
          size="small"
          circle
          @click="decreaseZoom"
        />

        <template #tip>
          <div class="el-upload__tip">
            图片大小不超过 2MB, 支持 png/jpg/jpeg 格式
          </div>
        </template>
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
import { getCurrentInstance, reactive, ref, toRefs } from 'vue'
import type { UploadProps, UploadFile, UploadInstance, UploadRawFile } from 'element-plus'
import { Minus, Plus, Upload } from '@element-plus/icons-vue'
import { Cropper, CropperResult, Preview } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { useUserStore } from '@/store/modules/user'
import { editUserAvatar } from '@/api/profile'

const userStore = useUserStore()

const { proxy }: any = getCurrentInstance()

const state = reactive({
  imageUrl: '' as string,
  imageFile: {} as UploadFile,
  // 结果
  result: {} as CropperResult,
  // 上传头像对话框
  avatarDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog
})

const {
  imageUrl,
  result,
  avatarDialog,
} = toRefs(state)

const uploadRef = ref<UploadInstance>()
const cropperRef = ref<any>()

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
  state.result = {} as CropperResult
}

// 头像上传 onChange 事件
const handleAvatarChange: UploadProps['onChange'] = (uploadFile: UploadFile) => {
  const supportTypes = ['image/png', 'image/jpg', 'image/jpeg']
  if (!uploadFile.raw) return
  if (supportTypes.includes(uploadFile.raw.type)) {
    proxy.$message.error('头像文件只能是 png/jpg/jpeg 格式!')
    return
  } else if (uploadFile.raw.size / 1024 / 1024 > 2) {
    proxy.$message.error('头像文件大小不能超过 2MB!')
    return
  }

  state.imageUrl = URL.createObjectURL(uploadFile.raw!)
  state.imageFile = uploadFile
}

// 裁剪框 onChange 事件
const handleCropperChange = (cropperResult: CropperResult) => {
  state.result = cropperResult

  // 将裁剪结果转换为 UploadFile 对象
  cropperResult.canvas?.toBlob((blob) => {
    let fileName = state.imageFile.name
    let fileType = state.imageFile.raw?.type
    let file: UploadRawFile = new File([blob!], fileName, { type: fileType }) as UploadRawFile
    file.uid = state.imageFile.uid
    state.imageFile.raw = file
  })
}

// 增加缩放比例
const increaseZoom = () => {
  cropperRef.value.zoom += 0.1
}

// 减小缩放比例
const decreaseZoom = () => {
  cropperRef.value.zoom -= 0.1
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

  .cropper {
    display: inline-block;
    height: 360px;
    width: 360px;
  }

  .preview {
    display: inline-block;
    margin-left: 20px;
  }
}
</style>
