<template>
  <!-- 导入用户信息对话框 -->
  <el-dialog
    :title="importDialog.title"
    v-model="importDialog.visible"
    @close="closeImportDialog"
  >
    <el-form
      ref="importRuleFormRef"
      :model="importForm"
      :rules="importRules"
      label-width="120px"
      status-icon
    >
      <el-form-item label="上传文件" props="file">
        <el-upload
          action=""
          :auto-upload="false"
          :limit="1"
          :on-exceed="() => proxy.$message.warning('只能上传一个文件')"
          :on-change="(file: UploadFile) => importFile = file"
          :on-remove="() => importFile = undefined"
          v-model="importForm.file"
          :file-list="importFile ? [importFile] : []"
          drag
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              xlsx files with a size less than 500kb
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <el-tree-select
          v-model="importForm.deptId"
          :data="deptTree"
          check-strictly
          filterable
          placeholder="请输入部门"
        />
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-select
          v-model="importForm.roleIds"
          placeholder="请选择角色"
          multiple
        >
          <el-option
            v-for="role in roleSelect"
            :key="role.value"
            :label="role.label"
            :value="role.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm(importRuleFormRef)"
        >确 定</el-button>
        <el-button
          @click="closeImportDialog"
        >取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue'
import { FormInstance, FormRules, UploadFile } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { getRoleSelect as selectRoleSelect, importUser } from '@/api/system/user'
import { deptTree as selectDeptTree } from '@/api/system/dept'
import { ImportForm } from '@/api/system/user/types'

const proxy = getProxy()

const state = reactive({
  // 部门树数据
  deptTree: [] as TreeSelect[],
  // 角色下拉框数据
  roleSelect: [] as TreeSelect[],
  // 导入对话框
  importDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  // 导入表单
  importForm: {} as ImportForm
})

const {
  deptTree,
  roleSelect,
  importDialog,
  importForm
} = toRefs(state)

const importFile = ref<UploadFile>()
const importRuleFormRef = ref<FormInstance>()
const importRules = reactive<FormRules>({
  file: [{ required: true, message: '文件不能为空', trigger: 'blur' }],
  deptId: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
  roleIds: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
})

// 导入用户信息
const handleImport = async () => {
  state.importDialog = {
    title: '导入用户信息',
    type: 'import',
    visible: true
  }

  await getDeptTree()
  await getRoleSelect()
}

// 查询部门树
const getDeptTree = async () => {
  const res: any = await selectDeptTree()
  state.deptTree = res.data
}

// 查询角色下拉框
const getRoleSelect = async () => {
  const res: any = await selectRoleSelect()
  state.roleSelect = res.data
}

// 关闭导入对话框
const closeImportDialog = () => {
  state.importDialog.visible = false
  importFile.value = undefined
  importRuleFormRef.value?.resetFields()
  importRuleFormRef.value?.clearValidate()
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    if (state.importDialog.type == 'import') {
      if (!importFile.value) {
        proxy.$message.error('请选择文件')
        return
      }
      await importUser(importFile.value, state.importForm.deptId, state.importForm.roleIds)
      proxy.$message.success('导入用户信息成功')
      closeImportDialog()
      proxy.$emit('submitted')
    }
  } catch (error) {
    console.log('error submit!', error)
  }
}

defineExpose({
  handleImport
})
</script>

<style lang="scss" scoped>
.user-avatar {
  width: 50px;
  height: 50px;
}
</style>
