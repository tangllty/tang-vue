<template>
  <div>
    <!-- 信息检索 -->
    <el-card class="mb-10">
      <el-form
        ref="dictTypeQueryFormRef"
        :model="queryParams"
        inline
      >
        <el-form-item label="字典名称" prop="typeName">
          <el-input
            v-model="queryParams.typeName"
            placeholder="字典名称"
            clearable
            @keyup.enter="handleList"
          />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input
            v-model="queryParams.dictType"
            placeholder="字典类型"
            clearable
            @keyup.enter="handleList"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="状态"
            clearable
          >
            <el-option
              v-for="item in sys_status"
              :key="item.dataId"
              :label="item.dataLabel"
              :value="item.dataValue"
            />
          </el-select>
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

    <!-- 字典类型数据 -->
    <el-card>

      <!-- 字典类型操作 -->
      <template #header>
        <el-row>
          <el-button
            type="primary"
            :icon="Plus"
            v-hasPermission="'system:dict:add'"
            @click="handleAdd"
          >新增</el-button>
          <el-button
            type="success"
            :icon="Edit"
            :disabled="dictTypeIds.length !== 1"
            v-hasPermission="'system:dict:edit'"
            @click="handleEdit"
          >修改</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="dictTypeIds.length === 0"
            v-hasPermission="'system:dict:delete'"
            @click="handleDeletes"
          >删除</el-button>
        </el-row>
      </template>

      <!-- 字典类型表格 -->
      <el-table
        v-loading="loading"
        :data="dictTypeList"
        row-key="dictTypeId"
        lazy
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="typeId"
          label="字典编号"
          align="center"
        />
        <el-table-column
          prop="typeName"
          label="字典名称"
          align="center"
        />
        <el-table-column
          label="字典类型"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <router-link :to="'/system/dict/data/' + scope.row.typeId">
              <el-link :underline="false">{{ scope.row.dictType }}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="80"
          align="center"
          prop="status"
        >
          <template #default="scope">
            <dict-tag :data="sys_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160"
          align="center"
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="160"
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
              v-hasPermission="'system:dict:edit'"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              type="primary"
              link
              :icon="Delete"
              size="small"
              v-hasPermission="'system:dict:delete'"
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

    <!-- 添加或修改字典类型信息对话框 -->
    <el-dialog
      :title="dictTypeDialog.title"
      v-model="dictTypeDialog.visible"
      @close="closeDictTypeDialog"
    >
      <el-form
        ref="dictTypeRuleFormRef"
        :model="dictTypeForm"
        :rules="dictTypeRules"
        label-width="120px"
        status-icon
      >
        <el-form-item label="字典名称" prop="typeName">
          <el-input
            v-model="dictTypeForm.typeName"
            placeholder="请输入字典名称"
          />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input
            v-model="dictTypeForm.dictType"
            placeholder="请输入字典类型"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dictTypeForm.status">
            <el-radio
              v-for="item in sys_status"
              :key="item.dataId"
              :label="item.dataValue"
            >{{ item.dataLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="dictTypeForm.remark"
            placeholder="请输入备注"
            type="textarea"
            maxlength="500"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitForm(dictTypeRuleFormRef)"
          >确 定</el-button>
          <el-button
            @click="closeDictTypeDialog"
          >取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { listDictType, getDictType, addDictType, editDictType, deleteDictType, deleteDictTypes } from '@/api/system/dict'
import { SysDictType, SysDictTypeForm, SysDictTypeQuery } from '@/api/system/dict/types'

const proxy = getProxy()
const { sys_status } = proxy.$dict('sys_status')

const state = reactive({
  // 遮罩层
  loading: false,
  // 选中数据
  dictTypeId: 0 as number,
  // 选中数据数组
  dictTypeIds: [] as number[],
  // 总条数
  total: 0,
  // 字典类型数据
  dictTypeList: [] as SysDictType[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as SysDictTypeQuery,
  // 对话框
  dictTypeDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  // 表单
  dictTypeForm: {} as SysDictTypeForm
})

const {
  loading,
  dictTypeIds,
  total,
  dictTypeList,
  queryParams,
  dictTypeDialog,
  dictTypeForm
} = toRefs(state)

const dictTypeRuleFormRef = ref<FormInstance>()
const dictTypeQueryFormRef = ref<FormInstance>()
const dictTypeRules = reactive<FormRules>({
  typeName: [
    { required: true, message: '字典名称不能为空', trigger: 'blur' },
    { min: 2, max: 32, message: '字典名称长度应在 2 到 32 之间', trigger: 'blur' },
  ],
  dictType: [
    { required: true, message: '字典类型不能为空', trigger: 'blur' },
    { min: 4, max: 64, message: '字典类型长度应在 4 到 64 之间', trigger: 'blur' },
  ],
})

// 查询字典类型列表
const handleList = async () => {
  state.loading = true
  const res: any = await listDictType(state.queryParams)
  state.dictTypeList = res.rows
  state.total = res.total
  state.loading = false
}

// 添加字典类型信息
const handleAdd = () => {
  state.dictTypeForm = {
    status: '0'
  } as SysDictTypeForm

  state.dictTypeDialog = {
    title: '新增字典类型信息',
    type: 'add',
    visible: true
  }
}

// 修改字典类型信息
const handleEdit = async (row: any) => {
  let typeId = state.dictTypeId
  if (row.typeId) {
    typeId = row.typeId
  }
  const res: any = await getDictType(typeId)
  state.dictTypeForm = res.data

  state.dictTypeDialog = {
    title: '修改字典类型信息',
    type: 'edit',
    visible: true
  }
}

// 删除字典类型信息
const handleDelete = async (row: any) => {
  try {
    await proxy.$confirm('确认删除"' + row.dictType + '"字典类型信息吗？', '提示', {
      type: 'warning'
    })
    await deleteDictType(row.typeId)
    proxy.$message.success('删除字典类型信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

// 批量删除字典类型信息
const handleDeletes = async () => {
  try {
    await proxy.$confirm('确认删除"' + state.dictTypeIds + '"字典类型信息吗？', '提示', {
      type: 'warning'
    })
    await deleteDictTypes(state.dictTypeIds)
    proxy.$message.success('删除字典类型信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

// 重置表单
const resetQuery = async () => {
  proxy.$resetForm(dictTypeQueryFormRef.value)
  await handleList()
}

// 关闭对话框
const closeDictTypeDialog = () => {
  state.dictTypeDialog.visible = false
  proxy.$resetForm(dictTypeRuleFormRef.value)
}

// 多选框
const handleSelectionChange = (selection: any) => {
  state.dictTypeIds = selection.map((item: any) => item.typeId)
  if (selection.length === 1) {
    state.dictTypeId = dictTypeIds.value[0]
  }
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    if (dictTypeDialog.value.type == 'add') {
      await addDictType(state.dictTypeForm)
      proxy.$message.success('添加字典类型信息成功')
      closeDictTypeDialog()
      await handleList()
    }
    if (dictTypeDialog.value.type == 'edit') {
      await editDictType(state.dictTypeForm)
      proxy.$message.success('修改字典类型信息成功')
      closeDictTypeDialog()
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
