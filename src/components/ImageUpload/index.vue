<template>
  <el-upload
    class="image-uploader"
    :action="actionUrl"
    :headers="headers"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <el-image
      v-if="imageUrl"
      :src="imageUrl"
      class="image"
    />
    <el-icon v-else class="image-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script lang="ts" setup>
import { onMounted, reactive, toRefs, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { getProxy } from '@/utils/getCurrentInstance'
import { getToken } from '@/utils/auth'

const proxy = getProxy()

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const state = reactive({
  actionUrl: import.meta.env.VITE_APP_URL + '/file/upload',
  imageUrl: '',
  headers: {
    Authorization: getToken(),
  },
})

const {
  actionUrl,
  imageUrl,
  headers,
} = toRefs(state)

watch(props, (val) => {
  imageUrl.value = ''
  if (!val.modelValue) return

  imageUrl.value = proxy.$path(val.modelValue)
},)

const handleAvatarSuccess: UploadProps['onSuccess'] = (res, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  proxy.$emit('update:modelValue', res.data.filePath)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const acceptFormat = ['image/jpeg', 'image/png']
  if (!acceptFormat.includes(rawFile.type)) {
    proxy.$message.error(`Avatar picture must be ${acceptFormat} format!`)
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    proxy.$message.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

onMounted(() => {
  if (props.modelValue) {
    imageUrl.value = proxy.$path(props.modelValue)
  }
})
</script>

<style lang="scss" scoped>
.image-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);

  &:hover {
    border-color: var(--el-color-primary);
  }

  .image {
    width: 178px;
    height: 178px;
    display: block;
  }

  .el-icon.image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
}
</style>
