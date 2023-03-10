<template>
  <div>
    <!-- 信息检索 -->
    <el-card style="margin-bottom: 10px;">
      <el-form ref="dictTypeQueryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="字典名称" prop="typeName">
          <el-input
            v-model="queryParams.typeName"
            placeholder="字典名称"
            style="width: 200px"
            @keyup.enter="handleList"
          />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input
            v-model="queryParams.dictType"
            placeholder="字典类型"
            style="width: 200px"
            @keyup.enter="handleList"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="状态"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in sys_status"
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
        <el-row class="mb-8">
          <el-button
            type="primary"
            :icon="Plus"
            v-hasPermission="'system:dict:add'"
            @click="handleAdd"
          >新增</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            v-hasPermission="'system:dict:delete'"
            @click="handleDelete"
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
        <el-table-column label="字典类型" align="center" show-overflow-tooltip>
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
import { getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'
import { listDictType, getDictType, addDictType, editDictType, deleteDictType } from '@/api/system/dict'
import { SysDictType as DictType, SysDictTypeForm, SysDictTypeQuery as DictTypeQuery } from '@/api/system/dict/types'

const { proxy }: any = getCurrentInstance()
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
  dictTypeList: [] as DictType[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as DictTypeQuery,
  // 对话框
  dictTypeDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  // 表单
  dictTypeForm: {
    status: '0'
  } as SysDictTypeForm
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
function handleList() {
  state.loading = true
  listDictType(state.queryParams).then((res:any) => {
    state.dictTypeList = res.rows
    state.total = res.total
    state.loading = false
  })
}

// 添加字典类型信息
function handleAdd() {
  state.dictTypeDialog = {
    title: '新增字典类型信息',
    type: 'add',
    visible: true
  }
}

// 修改字典类型信息
function handleEdit(row: any) {
  getDictType(row.dictTypeId).then((res: any) => {
    state.dictTypeForm = res.data
  })

  state.dictTypeDialog = {
    title: '修改字典类型信息',
    type: 'edit',
    visible: true
  }
}

// 删除字典类型信息
function handleDelete(row: any) {
  deleteDictType(row.dictTypeId).then(() => {
    ElMessage.success("删除字典类型信息成功")
    handleList()
  })
}

// 重置表单
function resetQuery() {
  dictTypeQueryFormRef.value?.resetFields()
  handleList()
}

// 关闭对话框
function closeDictTypeDialog() {
  state.dictTypeDialog.visible = false
  dictTypeRuleFormRef.value?.clearValidate()
  dictTypeRuleFormRef.value?.resetFields()
}

// 多选框
function handleSelectionChange(selection: any) {
  state.dictTypeIds = selection.map((item: any) => item.dictTypeId)
  if (selection.length === 1) {
    state.dictTypeId = dictTypeIds.value[0]
  }
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (dictTypeDialog.value.type == 'add') {
        addDictType(state.dictTypeForm).then(() => {
          ElMessage.success("添加字典类型信息成功")
          closeDictTypeDialog()
          handleList()
        })
      }
      if (dictTypeDialog.value.type == 'edit') {
        editDictType(state.dictTypeForm).then(() => {
          ElMessage.success("修改字典类型信息成功")
          closeDictTypeDialog()
          handleList()
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

onMounted(() => {
  handleList()
})
</script>

<style lang="scss" scoped>
</style>
