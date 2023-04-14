<template>
  <!-- 导入代码生成信息对话框 -->
  <el-dialog
    :title="previewCodeDialog.title"
    v-model="previewCodeDialog.visible"
    width="65%"
    @close="closePreviewCodeDialog"
    append-to-body
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
          style="float: right;"
          @click="handleCopy(value)"
        >复制</el-button>
        <pre>{{ value }}</pre>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'
import { previewCode } from '@/api/tool/generator'

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
const handlePreviewCode = (tableId: number) => {
  previewCode(tableId).then((res: any) => {
    state.code = res.data
  })
}

// 显示对话框
const handleShow = (tableId: number) => {
  handlePreviewCode(tableId)
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

// 代码复制
const handleCopy = (code: string) => {
  // TODO
  ElMessage.success("复制成功");
}

// 关闭对话框
const closePreviewCodeDialog = () => {
  state.previewCodeDialog.visible = false
  state.activeName = 'entity.java'
  state.code = {}
}

defineExpose({
  handleShow
})
</script>

<style lang="scss" scoped>
</style>
