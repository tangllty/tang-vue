<template>
  <div>
    <!-- 信息检索 -->
    <el-card class="mb-10">
      <el-form
        ref="dictDataQueryFormRef"
        :model="queryParams"
        inline
      >
        <el-form-item label="字典标签" prop="dataLabel">
          <el-input
            v-model="queryParams.dataLabel"
            placeholder="字典标签"
            @keyup.enter="handleList"
          />
        </el-form-item>
        <el-form-item label="字典键值" prop="dataValue">
          <el-input
            v-model="queryParams.dataValue"
            placeholder="字典键值"
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

    <!-- 字典数据数据 -->
    <el-card>

      <!-- 字典数据操作 -->
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
            :disabled="dictDataIds.length !== 1"
            v-hasPermission="'system:dict:edit'"
            @click="handleEdit"
          >修改</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="dictDataIds.length === 0"
            v-hasPermission="'system:dict:delete'"
            @click="handleDeletes"
          >删除</el-button>
        </el-row>
      </template>

      <!-- 字典数据表格 -->
      <el-table
        v-loading="loading"
        :data="dictDataList"
        row-key="dictDataId"
        lazy
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="dataId"
          label="数据编号"
          align="center"
        />
        <el-table-column
          prop="dataLabel"
          label="字典标签"
          align="center"
        />
        <el-table-column
          prop="dataValue"
          label="字典键值"
          align="center"
        />
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
          width="180"
          align="center"
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="180"
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

    <!-- 添加或修改字典数据信息对话框 -->
    <el-dialog
      :title="dictDataDialog.title"
      v-model="dictDataDialog.visible"
      @close="closeDictDataDialog"
    >
      <el-form
        ref="dictDataRuleFormRef"
        :model="dictDataForm"
        :rules="dictDataRules"
        label-width="120px"
        status-icon
      >
        <el-form-item label="字典类型" prop="dictType">
          <el-input
            v-model="dictDataForm.dictType"
            placeholder="请输入字典类型"
            disabled
          />
        </el-form-item>
        <el-form-item label="字典标签" prop="dataLabel">
          <el-input
            v-model="dictDataForm.dataLabel"
            placeholder="请输入字典标签"
          />
        </el-form-item>
        <el-form-item label="字典键值" prop="dataValue">
          <el-input
            v-model="dictDataForm.dataValue"
            placeholder="请输入字典键值"
          />
        </el-form-item>
        <el-form-item label="样式属性" prop="cssClass">
          <el-input
            v-model="dictDataForm.cssClass"
            placeholder="请输入样式属性"
          />
        </el-form-item>
        <el-form-item label="类型样式" prop="typeClass">
          <el-select
            v-model="dictDataForm.typeClass"
            placeholder="请选择类型样式"
          >
            <el-option label="默认" value="" />
            <el-option label="成功" value="success" />
            <el-option label="信息" value="info" />
            <el-option label="警告" value="warning" />
            <el-option label="危险" value="danger" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number
            v-model="dictDataForm.sort"
            :min="1"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dictDataForm.status">
            <el-radio
              v-for="item in sys_status"
              :key="item.dataId"
              :label="item.dataValue"
            >{{ item.dataLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="dictDataForm.remark"
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
            @click="submitForm(dictDataRuleFormRef)"
          >确 定</el-button>
          <el-button
            @click="closeDictDataDialog"
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
import { listDictData, getDictData, addDictData, editDictData, deleteDictData, deleteDictDatas } from '@/api/system/dict/data'
import { SysDictData, SysDictDataForm, SysDictDataQuery } from '@/api/system/dict/data/types'
import { getDictType } from '@/api/system/dict'

const proxy = getProxy()
const { sys_status } = proxy.$dict('sys_status')

const props = defineProps({
  typeId: {
    type: Number,
    required: true
  },
})

const state = reactive({
  // 遮罩层
  loading: false,
  // 选中数据
  dictDataId: 0 as number,
  // 选中数据数组
  dictDataIds: [] as number[],
  // 总条数
  total: 0,
  // 字典数据数据
  dictDataList: [] as SysDictData[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as SysDictDataQuery,
  // 对话框
  dictDataDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  // 表单
  dictDataForm: {} as SysDictDataForm
})

const {
  loading,
  dictDataIds,
  total,
  dictDataList,
  queryParams,
  dictDataDialog,
  dictDataForm
} = toRefs(state)

const dictDataRuleFormRef = ref<FormInstance>()
const dictDataQueryFormRef = ref<FormInstance>()
const dictDataRules = reactive<FormRules>({
  dataLabel: [
    { required: true, message: '字典名称不能为空', trigger: 'blur' },
    { min: 1, max: 32, message: '字典名称长度应在 1 到 32 之间', trigger: 'blur' },
  ],
  dataValue: [
    { required: true, message: '字典数据不能为空', trigger: 'blur' },
    { min: 1, max: 32, message: '字典数据长度应在 1 到 32 之间', trigger: 'blur' },
  ],
})

// 查询字典数据列表
const handleList = async () => {
  state.loading = true
  const res: any = await listDictData(state.queryParams)
  state.dictDataList = res.rows
  state.total = res.total
  state.loading = false
}

// 添加字典数据信息
const handleAdd = async () => {
  state.dictDataForm = {
    typeClass: '',
    sort: 1,
    status: '0'
  } as SysDictDataForm

  const res: any = await getDictType(props.typeId)
  state.dictDataForm.dictType = res.data.dictType

  state.dictDataDialog = {
    title: '新增字典数据信息',
    type: 'add',
    visible: true
  }
}

// 修改字典数据信息
const handleEdit = async (row: any) => {
  let dataId = state.dictDataId
  if (row.dataId) {
    dataId = row.dataId
  }
  const res: any = await getDictData(dataId)
  state.dictDataForm = res.data

  state.dictDataDialog = {
    title: '修改字典数据信息',
    type: 'edit',
    visible: true
  }
}

// 删除字典数据信息
const handleDelete = async (row: any) => {
  try {
    await proxy.$confirm('确认要删除"' + row.dataLabel + '"字典数据信息吗?', '警告', {
      type: 'warning'
    })
    await deleteDictData(row.dataId)
    proxy.$message.success('删除字典数据信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

// 批量删除字典数据信息
const handleDeletes = async () => {
  try {
    await proxy.$confirm('确认要删除"' + state.dictDataIds + '"字典数据信息吗?', '警告', {
      type: 'warning'
    })
    await deleteDictDatas(state.dictDataIds)
    proxy.$message.success('删除字典数据信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

// 重置表单
const resetQuery = async () => {
  proxy.$resetForm(dictDataQueryFormRef.value)
  await handleList()
}

// 关闭对话框
const closeDictDataDialog = () => {
  state.dictDataDialog.visible = false
  proxy.$resetForm(dictDataRuleFormRef.value)
}

// 多选框
const handleSelectionChange = (selection: any) => {
  state.dictDataIds = selection.map((item: any) => item.dataId)
  if (selection.length === 1) {
    state.dictDataId = dictDataIds.value[0]
  }
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    if (dictDataDialog.value.type == 'add') {
      await addDictData(state.dictDataForm)
      proxy.$message.success('添加字典数据信息成功')
      closeDictDataDialog()
      await handleList()
    }
    if (dictDataDialog.value.type == 'edit') {
      await editDictData(state.dictDataForm)
      proxy.$message.success('修改字典数据信息成功')
      closeDictDataDialog()
      await handleList()
    }
  } catch (error) {
    console.log('error submit!', error)
  }
}

onMounted(async () => {
  const res: any = await getDictType(props.typeId)
  state.queryParams.dictType = res.data.dictType
  await handleList()
})
</script>

<style lang="scss" scoped>
</style>
