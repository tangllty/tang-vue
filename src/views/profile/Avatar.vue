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
        accept="image/*"
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

        <el-tooltip content="放大" placement="top">
          <el-button
            :icon="Plus"
            size="small"
            circle
            @click="zoomIn"
            class="ml-10"
          />
        </el-tooltip>
        <el-tooltip content="缩小" placement="top">
          <el-button
            :icon="Minus"
            size="small"
            circle
            @click="zoomOut"
          />
        </el-tooltip>
        <el-tooltip content="上移" placement="top">
          <el-button
            :icon="Top"
            size="small"
            circle
            @click="moveTop"
          />
        </el-tooltip>
        <el-tooltip content="下移" placement="top">
          <el-button
            :icon="Bottom"
            size="small"
            circle
            @click="moveBottom"
          />
        </el-tooltip>
        <el-tooltip content="左移" placement="top">
          <el-button
            :icon="Back"
            size="small"
            circle
            @click="moveLeft"
          />
        </el-tooltip>
        <el-tooltip content="右移" placement="top">
          <el-button
            :icon="Right"
            size="small"
            circle
            @click="moveRight"
          />
        </el-tooltip>
        <el-tooltip content="水平翻转" placement="top">
          <el-button
            size="small"
            circle
            @click="flipHorizontal"
          >
            <template #icon>
              <el-icon><SvgIcon name="flip-horizontal" /></el-icon>
            </template>
          </el-button>
        </el-tooltip>
        <el-tooltip content="垂直翻转" placement="top">
          <el-button
            size="small"
            circle
            @click="flipVertical"
          >
            <template #icon>
              <el-icon><SvgIcon name="flip-vertical" /></el-icon>
            </template>
          </el-button>
        </el-tooltip>
        <el-tooltip content="顺时针旋转" placement="top">
          <el-button
            size="small"
            circle
            @click="rotateClockwise"
          >
            <template #icon>
              <el-icon><SvgIcon name="rotate-clockwise" /></el-icon>
            </template>
          </el-button>
        </el-tooltip>
        <el-tooltip content="逆时针旋转" placement="top">
          <el-button
            size="small"
            circle
            @click="rotateCounterClockwise"
          >
            <template #icon>
              <el-icon><SvgIcon name="rotate-counter-clockwise" /></el-icon>
            </template>
          </el-button>
        </el-tooltip>

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
import type { UploadProps, UploadFile, UploadInstance, UploadRawFile } from 'element-plus'
import { Minus, Plus, Upload, Top, Bottom, Back, Right } from '@element-plus/icons-vue'
import { Cropper, CropperResult, Preview } from 'vue-advanced-cropper'
import type { CropperInstance } from './instance'
import 'vue-advanced-cropper/dist/style.css'
import { useUserStore } from '@/store/modules/user'
import { getProxy } from '@/utils/getCurrentInstance'
import { editUserAvatar } from '@/api/profile'

const proxy = getProxy()

const userStore = useUserStore()

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
const cropperRef = ref<CropperInstance>()

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
  if (!uploadFile.raw) return
  if (uploadFile.raw.size / 1024 / 1024 > 5) {
    proxy.$message.error('头像文件大小不能超过 5MB!')
    return
  }

  state.imageUrl = URL.createObjectURL(uploadFile.raw)
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

const zoom = 0.15
const move = 30
const rotate = 90

// 增加缩放比例
const zoomIn = () => {
  cropperRef.value?.zoom(1 + zoom)
}

// 减小缩放比例
const zoomOut = () => {
  cropperRef.value?.zoom(1 - zoom)
}

const moveTop = () => {
  cropperRef.value?.move(0, -move)
}

const moveBottom = () => {
  cropperRef.value?.move(0, move)
}

const moveLeft = () => {
  cropperRef.value?.move(-move, 0)
}

const moveRight = () => {
  cropperRef.value?.move(move, 0)
}

const flipHorizontal = () => {
  cropperRef.value?.flip(true)
}

const flipVertical = () => {
  cropperRef.value?.flip(false, true)
}

const rotateClockwise = () => {
  cropperRef.value?.rotate(rotate)
}

const rotateCounterClockwise = () => {
  cropperRef.value?.rotate(-rotate)
}

// 提交头像上传
const submitUpload = async () => {
  if (!state.imageFile.raw) return
  await editUserAvatar(state.imageFile)
  proxy.$message.success('头像上传成功!')
  await userStore.getInfo()
  closeAvatarDialog()
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
    background-color: rgba(204, 204, 204, 0.3);
  }

  .preview {
    display: inline-block;
    margin-left: 20px;
    border: 1px solid rgba(204, 204, 204, 0.7);
    background-color: rgba(204, 204, 204, 0.3);
  }
}
</style>
