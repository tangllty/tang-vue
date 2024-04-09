<template>
  <!-- 导入代码生成信息对话框 -->
  <el-dialog
    :title="previewCodeDialog.title"
    v-model="previewCodeDialog.visible"
    width="65%"
    @close="closePreviewCodeDialog"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="(value, key) in code"
        :key="key"
        :label="getKey(key)"
        :name="getKey(key)"
      >
        <el-button
          type="primary"
          link
          :icon="DocumentCopy"
          size="small"
          class="fr"
          @click="handleCopy(value)"
        >复制</el-button>
        <Highlight
          :code="value"
          :autodetect="false"
          :language="getLanguage(key)"
        />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { DocumentCopy } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { previewCode } from '@/api/tool/generator'

const proxy = getProxy()

const state = reactive({
  code: {},
  activeName: 'entity.java',
  // 对话框
  previewCodeDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog
})

const {
  code,
  activeName,
  previewCodeDialog
} = toRefs(state)

// 查询代码生成列表
const handlePreviewCode = async (tableId: number) => {
  const res: any = await previewCode(tableId)
  state.code = res.data
}

// 显示对话框
const handleShow = async (tableId: number) => {
  await handlePreviewCode(tableId)
  await handleActiveName()
  state.previewCodeDialog = {
    title: '代码预览',
    type: 'list',
    visible: true
  }
}

// 获取 key
const getKey = (key: string): string => {
  return key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm'))
}

// 获取语言
const getLanguage = (key: string): string => {
  return getKey(key).split('.')[1]
}

// 设置 activeName
const handleActiveName = async () => {
  const firstKey = Object.keys(state.code)[0]
  const postfix = firstKey.substring(firstKey.lastIndexOf('/') + 1, firstKey.indexOf('.vm'))
  state.activeName = postfix
}

// 代码复制
const handleCopy = async (code: string) => {
  await navigator.clipboard.writeText(code)
  proxy.$message.success('复制成功')
}

// 关闭对话框
const closePreviewCodeDialog = () => {
  state.previewCodeDialog.visible = false
  state.activeName = ''
  state.code = {}
}

defineExpose({
  handleShow
})
</script>

<style lang="scss" scoped>
</style>
