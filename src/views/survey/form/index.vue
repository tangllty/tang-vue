<template>
  <div>
    <!-- 信息检索 -->
    <el-card class="mb-10">
      <el-form
        ref="surveyFormQueryFormRef"
        :model="queryParams"
        inline
      >
        <el-form-item label="问卷ID" prop="formId">
          <el-input
            v-model="queryParams.formId"
            placeholder="请输入问卷ID"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="问卷编码" prop="formCode">
          <el-input
            v-model="queryParams.formCode"
            placeholder="请输入问卷编码"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="问卷名称" prop="formName">
          <el-input
            v-model="queryParams.formName"
            placeholder="请输入问卷名称"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="问卷数据" prop="formData">
          <el-input
            v-model="queryParams.formData"
            placeholder="请输入问卷数据"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="发布状态" prop="publishStatus">
          <el-select
            v-model="queryParams.publishStatus"
            placeholder="请选择发布状态"
            @change="handleList"
            clearable
          >
            <el-option
              v-for="item in qs_survey_form_publish_status"
              :key="item.dataId"
              :value="item.dataValue"
              :label="item.dataLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            @change="handleList"
            clearable
          >
            <el-option
              v-for="item in sys_status"
              :key="item.dataId"
              :value="item.dataValue"
              :label="item.dataLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建者" prop="createBy">
          <el-input
            v-model="queryParams.createBy"
            placeholder="请输入创建者"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="更新者" prop="updateBy">
          <el-date-picker
            v-model="queryParams.updateBy"
            type="date"
            placeholder="选择更新者日期"
            value-format="YYYY-MM-DD"
            @change="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="queryParams.remark"
            placeholder="请输入备注"
            @keyup.enter="handleList"
            clearable
          />
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

    <!-- 调查问卷数据 -->
    <el-card>

      <!-- 调查问卷操作 -->
      <template #header>
        <el-row>
          <el-button
            type="primary"
            :icon="Plus"
            v-hasPermission="'survey:form:add'"
            @click="handleAdd"
          >新增</el-button>
          <el-button
            type="success"
            :icon="Edit"
            :disabled="formIds.length !== 1"
            v-hasPermission="'system:dict:edit'"
            @click="handleEdit(null)"
          >修改</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="formIds.length === 0"
            v-hasPermission="'survey:form:delete'"
            @click="handleDeletes"
          >删除</el-button>
        </el-row>
      </template>

      <!-- 调查问卷表格 -->
      <el-table
        v-loading="loading"
        :data="surveyFormList"
        row-key="formId"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="formId"
          label="问卷ID"
          align="center"
        />
        <el-table-column
          prop="formCode"
          label="问卷编码"
          align="center"
          width="90"
          show-overflow-tooltip
        />
        <el-table-column
          prop="formName"
          label="问卷名称"
          align="center"
          width="90"
        />
        <el-table-column
          prop="formData"
          label="问卷数据"
          align="center"
          width="140"
        >
          <template #default="scope">
            <el-button
              type="primary"
              link
              :icon="View"
              size="small"
              v-hasPermission="'survey:form:list'"
              @click="handleViewData(scope.row)"
            >查看</el-button>
            <el-button
              type="primary"
              link
              size="small"
              v-hasPermission="'survey:form:edit'"
              @click="handleDesign(scope.row)"
            >
              <router-link :to="'/survey/form/design/' + scope.row.formId">
                <el-link
                  type="primary"
                  :icon="Edit"
                  :underline="false"
                >设计</el-link>
              </router-link>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="publishStatus"
          label="发布状态"
          align="center"
          width="90"
        >
          <template #default="scope">
            <dict-tag :data="qs_survey_form_publish_status" :value="scope.row.publishStatus" />
          </template>
        </el-table-column>
        <el-table-column
          prop="publishTime"
          label="发布时间"
          align="center"
          width="160"
        />
        <el-table-column
          prop="closeTime"
          label="关闭时间"
          align="center"
          width="160"
        />
        <el-table-column
          prop="status"
          label="状态"
          align="center"
        >
          <template #default="scope">
            <dict-tag :data="sys_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          prop="createBy"
          label="创建者"
          align="center"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="160"
        />
        <el-table-column
          prop="updateBy"
          label="更新者"
          align="center"
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
          align="center"
          width="160"
        />
        <el-table-column
          prop="remark"
          label="备注"
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
              :icon="Position"
              size="small"
              v-hasPermission="'survey:form:edit'"
              @click="handlePublish(scope.row)"
            >发布</el-button>
            <el-button
              type="primary"
              link
              :icon="Edit"
              size="small"
              v-hasPermission="'survey:form:edit'"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              type="primary"
              link
              :icon="Delete"
              size="small"
              v-hasPermission="'survey:form:delete'"
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

    <!-- 添加或修改调查问卷信息对话框 -->
    <el-dialog
      :title="surveyFormDialog.title"
      v-model="surveyFormDialog.visible"
      @close="closeSurveyFormDialog"
    >
      <el-form
        ref="surveyFormRuleFormRef"
        :model="surveyFormForm"
        :rules="surveyFormRules"
        label-width="120px"
        status-icon
      >
        <!-- <el-form-item label="问卷编码" prop="formCode">
          <el-input
            v-model="surveyFormForm.formCode"
            placeholder="请输入问卷编码"
          />
        </el-form-item> -->
        <el-form-item label="问卷名称" prop="formName">
          <el-input
            v-model="surveyFormForm.formName"
            placeholder="请输入问卷名称"
          />
        </el-form-item>
        <!-- <el-form-item label="问卷数据" prop="formData">
          <el-input
            v-model="surveyFormForm.formData"
            placeholder="请输入问卷数据"
          />
        </el-form-item> -->
        <el-form-item label="发布状态" prop="publishStatus">
          <el-radio-group v-model="surveyFormForm.publishStatus">
            <el-radio
              v-for="item in qs_survey_form_publish_status"
              :key="item.dataId"
              :label="item.dataValue"
            >{{ item.dataLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker
            v-model="surveyFormForm.publishTime"
            type="datetime"
            placeholder="选择发布时间日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item> -->
        <el-form-item label="关闭时间" prop="closeTime">
          <el-date-picker
            v-model="surveyFormForm.closeTime"
            type="datetime"
            placeholder="选择关闭时间日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="surveyFormForm.status">
            <el-radio
              v-for="item in sys_status"
              :key="item.dataId"
              :label="item.dataValue"
            >{{ item.dataLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitForm(surveyFormRuleFormRef)"
          >确 定</el-button>
          <el-button
            @click="closeSurveyFormDialog"
          >取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Search, Refresh, Position, View } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { listSurveyForm, getSurveyForm, addSurveyForm, editSurveyForm, publishSurveyForm, deleteSurveyForm, deleteSurveyForms } from '@/api/survey/form'
import type { SurveyForm, SurveyFormForm, SurveyFormQuery } from '@/api/survey/form/types'

const proxy = getProxy()
const { qs_survey_form_publish_status, sys_status } = proxy.$dict('qs_survey_form_publish_status', 'sys_status')

const state = reactive({
  /** 遮罩层 */
  loading: false as boolean,
  /** 选中数据 */
  formId: 0 as number,
  /** 选中数据数组 */
  formIds: [] as number[],
  /** 总条数 */
  total: 0 as number,
  /** 调查问卷数据 */
  surveyFormList: [] as SurveyForm[],
  /** 查询参数 */
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as SurveyFormQuery,
  /** 调查问卷对话框 */
  surveyFormDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  /** 调查问卷表单 */
  surveyFormForm: {} as SurveyFormForm
})

const {
  loading,
  formIds,
  total,
  surveyFormList,
  queryParams,
  surveyFormDialog,
  surveyFormForm
} = toRefs(state)

const surveyFormRuleFormRef = ref<FormInstance>()
const surveyFormQueryFormRef = ref<FormInstance>()
const surveyFormRules = reactive<FormRules>({
  formCode: [
    { required: true, message: '问卷编码不能为空', trigger: 'blur' },
  ],
  formName: [
    { required: true, message: '问卷名称不能为空', trigger: 'blur' },
  ],
  formData: [
    { required: true, message: '问卷数据不能为空', trigger: 'blur' },
  ],
  publishStatus: [
    { required: true, message: '发布状态{0=未发布, 1=已发布}不能为空', trigger: 'blur' },
  ],
  publishTime: [
    { required: true, message: '发布时间不能为空', trigger: 'blur' },
  ],
  closeTime: [
    { required: true, message: '关闭时间不能为空', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '状态{0=正常, 1=停用}不能为空', trigger: 'blur' },
  ],
})

/**
 * 查询调查问卷列表
 */
const handleList = async () => {
  state.loading = true
  const res: any = await listSurveyForm(state.queryParams)
  state.surveyFormList = res.rows
  state.total = res.total
  state.loading = false
}

/**
 * 查看调查问卷数据
 *
 * @param row 调查问卷信息
 */
const handleViewData = async (row: SurveyForm) => {
  // TODO view the survey form data
}

/**
 * 添加调查问卷信息
 */
const handleAdd = () => {
  state.surveyFormDialog = {
    title: '新增调查问卷信息',
    type: 'add',
    visible: true
  }
}

/**
 * 修改调查问卷信息
 *
 * @param row 调查问卷信息
 */
const handleEdit = async (row: SurveyForm | null) => {
  let formId = state.formId
  if (row) {
    formId = row.formId
  }
  const res = await getSurveyForm(formId)
  state.surveyFormForm = res.data

  state.surveyFormDialog = {
    title: '修改调查问卷信息',
    type: 'edit',
    visible: true
  }
}

/**
 * 发布调查问卷信息
 *
 * @param row 调查问卷信息
 */
const handlePublish = async (row: SurveyForm) => {
  try {
    await proxy.$confirm('确认发布"' + row.formName + '"调查问卷信息吗？', '提示', {
      type: 'warning'
    })
    await publishSurveyForm(row.formId)
    proxy.$message.success('发布调查问卷信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

/**
 * 设计调查问卷信息
 *
 * @param row 调查问卷信息
 */
const handleDesign = async (row: SurveyForm) => {

}

/**
 * 删除调查问卷信息
 *
 * @param row 调查问卷信息
 */
const handleDelete = async (row: SurveyForm) => {
  try {
    await proxy.$confirm('确认删除"' + row.formId + '"调查问卷信息吗？', '提示', {
      type: 'warning'
    })
    await deleteSurveyForm(row.formId)
    proxy.$message.success('删除调查问卷信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

/**
 * 批量删除调查问卷信息
 */
const handleDeletes = async () => {
  try {
    await proxy.$confirm('确认删除"' + state.formIds + '"调查问卷信息吗？', '提示', {
      type: 'warning'
    })
    await deleteSurveyForms(state.formIds)
    proxy.$message.success('删除调查问卷信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

/**
 * 重置表单
 */
const resetQuery = async () => {
  proxy.$resetForm(surveyFormQueryFormRef.value)
  await handleList()
}

/**
 * 关闭调查问卷对话框
 */
const closeSurveyFormDialog = () => {
  state.surveyFormDialog.visible = false
  proxy.$resetForm(surveyFormRuleFormRef.value)
  state.surveyFormForm = {} as SurveyFormForm
}

/**
 * 选中数据
 *
 * @param selection 选中数据
 */
const handleSelectionChange = (selection: SurveyForm[]) => {
  state.formIds = selection.map((surveyForm: SurveyForm) => surveyForm.formId)
  if (selection.length === 1) {
    state.formId = formIds.value[0]
  }
}

/**
 * 提交表单
 *
 * @param formEl 表单实例
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    if (surveyFormDialog.value.type == 'add') {
      await addSurveyForm(state.surveyFormForm)
      proxy.$message.success('添加调查问卷信息成功')
      closeSurveyFormDialog()
      await handleList()
    }
    if (surveyFormDialog.value.type == 'edit') {
      await editSurveyForm(state.surveyFormForm)
      proxy.$message.success('修改调查问卷信息成功')
      closeSurveyFormDialog()
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
