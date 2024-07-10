<template>
  <div>
    <!-- 信息检索 -->
    <el-card class="mb-10">
      <el-form
        ref="surveyUserAnswerQueryFormRef"
        :model="queryParams"
        inline
      >
        <el-form-item label="答案ID" prop="answerId">
          <el-input
            v-model="queryParams.answerId"
            placeholder="请输入答案ID"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="问卷ID" prop="formId">
          <el-input
            v-model="queryParams.formId"
            placeholder="请输入问卷ID"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="答案数据" prop="answerData">
          <el-input
            v-model="queryParams.answerData"
            placeholder="请输入答案数据"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input
            v-model="queryParams.ip"
            placeholder="请输入IP地址"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="地点" prop="location">
          <el-input
            v-model="queryParams.location"
            placeholder="请输入地点"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="是否为手机" prop="mobile">
          <el-input
            v-model="queryParams.mobile"
            placeholder="请输入是否为手机"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="浏览器" prop="browser">
          <el-input
            v-model="queryParams.browser"
            placeholder="请输入浏览器"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input
            v-model="queryParams.version"
            placeholder="请输入版本"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="平台" prop="platform">
          <el-input
            v-model="queryParams.platform"
            placeholder="请输入平台"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="操作系统" prop="os">
          <el-input
            v-model="queryParams.os"
            placeholder="请输入操作系统"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="系统版本" prop="osVersion">
          <el-input
            v-model="queryParams.osVersion"
            placeholder="请输入系统版本"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="引擎" prop="engine">
          <el-input
            v-model="queryParams.engine"
            placeholder="请输入引擎"
            @keyup.enter="handleList"
            clearable
          />
        </el-form-item>
        <el-form-item label="引擎版本" prop="engineVersion">
          <el-input
            v-model="queryParams.engineVersion"
            placeholder="请输入引擎版本"
            @keyup.enter="handleList"
            clearable
          />
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

    <!-- 调查问卷用户答案数据 -->
    <el-card>

      <!-- 调查问卷用户答案操作 -->
      <template #header>
        <el-row>
          <el-button
            type="primary"
            :icon="Plus"
            v-hasPermission="'survey:answer:add'"
            @click="handleAdd"
          >新增</el-button>
          <el-button
            type="success"
            :icon="Edit"
            :disabled="answerIds.length !== 1"
            v-hasPermission="'system:dict:edit'"
            @click="handleEdit(null)"
          >修改</el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="answerIds.length === 0"
            v-hasPermission="'survey:answer:delete'"
            @click="handleDeletes"
          >删除</el-button>
        </el-row>
      </template>

      <!-- 调查问卷用户答案表格 -->
      <el-table
        v-loading="loading"
        :data="surveyUserAnswerList"
        row-key="answerId"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="answerId"
          label="答案ID"
          align="center"
        />
        <el-table-column
          prop="formId"
          label="问卷ID"
          align="center"
        />
        <el-table-column
          prop="answerData"
          label="答案数据"
          align="center"
        />
        <el-table-column
          prop="answerTime"
          label="答题耗时(毫秒)"
          align="center"
        />
        <el-table-column
          prop="ip"
          label="IP地址"
          align="center"
        />
        <el-table-column
          prop="location"
          label="地点"
          align="center"
        />
        <el-table-column
          prop="mobile"
          label="是否为手机"
          align="center"
        />
        <el-table-column
          prop="browser"
          label="浏览器"
          align="center"
        />
        <el-table-column
          prop="version"
          label="版本"
          align="center"
        />
        <el-table-column
          prop="platform"
          label="平台"
          align="center"
        />
        <el-table-column
          prop="os"
          label="操作系统"
          align="center"
        />
        <el-table-column
          prop="osVersion"
          label="系统版本"
          align="center"
        />
        <el-table-column
          prop="engine"
          label="引擎"
          align="center"
        />
        <el-table-column
          prop="engineVersion"
          label="引擎版本"
          align="center"
        />
        <el-table-column
          prop="createBy"
          label="创建者"
          align="center"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
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
              :icon="Edit"
              size="small"
              v-hasPermission="'survey:answer:edit'"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              type="primary"
              link
              :icon="Delete"
              size="small"
              v-hasPermission="'survey:answer:delete'"
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

    <!-- 添加或修改调查问卷用户答案信息对话框 -->
    <el-dialog
      :title="surveyUserAnswerDialog.title"
      v-model="surveyUserAnswerDialog.visible"
      @close="closeSurveyUserAnswerDialog"
    >
      <el-form
        ref="surveyUserAnswerRuleFormRef"
        :model="surveyUserAnswerForm"
        :rules="surveyUserAnswerRules"
        label-width="120px"
        status-icon
      >
        <el-form-item label="问卷ID" prop="formId">
          <el-input
            v-model="surveyUserAnswerForm.formId"
            placeholder="请输入问卷ID"
          />
        </el-form-item>
        <el-form-item label="答案数据" prop="answerData">
          <el-input
            v-model="surveyUserAnswerForm.answerData"
            placeholder="请输入答案数据"
          />
        </el-form-item>
        <el-form-item label="答题耗时(毫秒)" prop="answerTime">
          <el-date-picker
            v-model="surveyUserAnswerForm.answerTime"
            type="datetime"
            placeholder="选择答题耗时(毫秒)日期时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input
            v-model="surveyUserAnswerForm.ip"
            placeholder="请输入IP地址"
          />
        </el-form-item>
        <el-form-item label="地点" prop="location">
          <el-input
            v-model="surveyUserAnswerForm.location"
            placeholder="请输入地点"
          />
        </el-form-item>
        <el-form-item label="是否为手机" prop="mobile">
          <el-input
            v-model="surveyUserAnswerForm.mobile"
            placeholder="请输入是否为手机"
          />
        </el-form-item>
        <el-form-item label="浏览器" prop="browser">
          <el-input
            v-model="surveyUserAnswerForm.browser"
            placeholder="请输入浏览器"
          />
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input
            v-model="surveyUserAnswerForm.version"
            placeholder="请输入版本"
          />
        </el-form-item>
        <el-form-item label="平台" prop="platform">
          <el-input
            v-model="surveyUserAnswerForm.platform"
            placeholder="请输入平台"
          />
        </el-form-item>
        <el-form-item label="操作系统" prop="os">
          <el-input
            v-model="surveyUserAnswerForm.os"
            placeholder="请输入操作系统"
          />
        </el-form-item>
        <el-form-item label="系统版本" prop="osVersion">
          <el-input
            v-model="surveyUserAnswerForm.osVersion"
            placeholder="请输入系统版本"
          />
        </el-form-item>
        <el-form-item label="引擎" prop="engine">
          <el-input
            v-model="surveyUserAnswerForm.engine"
            placeholder="请输入引擎"
          />
        </el-form-item>
        <el-form-item label="引擎版本" prop="engineVersion">
          <el-input
            v-model="surveyUserAnswerForm.engineVersion"
            placeholder="请输入引擎版本"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitForm(surveyUserAnswerRuleFormRef)"
          >确 定</el-button>
          <el-button
            @click="closeSurveyUserAnswerDialog"
          >取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'
import { getProxy } from '@/utils/getCurrentInstance'
import { listSurveyUserAnswer, getSurveyUserAnswer, addSurveyUserAnswer, editSurveyUserAnswer, deleteSurveyUserAnswer, deleteSurveyUserAnswers } from '@/api/survey/answer'
import type { SurveyUserAnswer, SurveyUserAnswerForm, SurveyUserAnswerQuery } from '@/api/survey/answer/types'

const proxy = getProxy()

const state = reactive({
  /** 遮罩层 */
  loading: false as boolean,
  /** 选中数据 */
  answerId: 0 as number,
  /** 选中数据数组 */
  answerIds: [] as number[],
  /** 总条数 */
  total: 0 as number,
  /** 调查问卷用户答案数据 */
  surveyUserAnswerList: [] as SurveyUserAnswer[],
  /** 查询参数 */
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as SurveyUserAnswerQuery,
  /** 调查问卷用户答案对话框 */
  surveyUserAnswerDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  /** 调查问卷用户答案表单 */
  surveyUserAnswerForm: {} as SurveyUserAnswerForm
})

const {
  loading,
  answerIds,
  total,
  surveyUserAnswerList,
  queryParams,
  surveyUserAnswerDialog,
  surveyUserAnswerForm
} = toRefs(state)

const surveyUserAnswerRuleFormRef = ref<FormInstance>()
const surveyUserAnswerQueryFormRef = ref<FormInstance>()
const surveyUserAnswerRules = reactive<FormRules>({
  formId: [
    { required: true, message: '问卷ID不能为空', trigger: 'blur' },
  ],
  answerData: [
    { required: true, message: '答案数据不能为空', trigger: 'blur' },
  ],
  answerTime: [
    { required: true, message: '答题耗时(毫秒)不能为空', trigger: 'blur' },
  ],
  ip: [
    { required: true, message: 'IP地址不能为空', trigger: 'blur' },
  ],
  location: [
    { required: true, message: '地点不能为空', trigger: 'blur' },
  ],
  mobile: [
    { required: true, message: '是否为手机不能为空', trigger: 'blur' },
  ],
  browser: [
    { required: true, message: '浏览器不能为空', trigger: 'blur' },
  ],
  version: [
    { required: true, message: '版本不能为空', trigger: 'blur' },
  ],
  platform: [
    { required: true, message: '平台不能为空', trigger: 'blur' },
  ],
  os: [
    { required: true, message: '操作系统不能为空', trigger: 'blur' },
  ],
  osVersion: [
    { required: true, message: '系统版本不能为空', trigger: 'blur' },
  ],
  engine: [
    { required: true, message: '引擎不能为空', trigger: 'blur' },
  ],
  engineVersion: [
    { required: true, message: '引擎版本不能为空', trigger: 'blur' },
  ],
})

/**
 * 查询调查问卷用户答案列表
 */
const handleList = async () => {
  state.loading = true
  const res: any = await listSurveyUserAnswer(state.queryParams)
  state.surveyUserAnswerList = res.rows
  state.total = res.total
  state.loading = false
}

/**
 * 添加调查问卷用户答案信息
 */
const handleAdd = () => {
  state.surveyUserAnswerDialog = {
    title: '新增调查问卷用户答案信息',
    type: 'add',
    visible: true
  }
}

/**
 * 修改调查问卷用户答案信息
 *
 * @param row 调查问卷用户答案信息
 */
const handleEdit = async (row: SurveyUserAnswer | null) => {
  let answerId = state.answerId
  if (row) {
    answerId = row.answerId
  }
  const res = await getSurveyUserAnswer(answerId)
  state.surveyUserAnswerForm = res.data

  state.surveyUserAnswerDialog = {
    title: '修改调查问卷用户答案信息',
    type: 'edit',
    visible: true
  }
}

/**
 * 删除调查问卷用户答案信息
 *
 * @param row 调查问卷用户答案信息
 */
const handleDelete = async (row: SurveyUserAnswer) => {
  try {
    await proxy.$confirm('确认删除"' + row.answerId + '"调查问卷用户答案信息吗？', '提示', {
      type: 'warning'
    })
    await deleteSurveyUserAnswer(row.answerId)
    proxy.$message.success('删除调查问卷用户答案信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

/**
 * 批量删除调查问卷用户答案信息
 */
const handleDeletes = async () => {
  try {
    await proxy.$confirm('确认删除"' + state.answerIds + '"调查问卷用户答案信息吗？', '提示', {
      type: 'warning'
    })
    await deleteSurveyUserAnswers(state.answerIds)
    proxy.$message.success('删除调查问卷用户答案信息成功')
    await handleList()
  } catch (error) {
    console.log(error)
  }
}

/**
 * 重置表单
 */
const resetQuery = async () => {
  proxy.$resetForm(surveyUserAnswerQueryFormRef.value)
  await handleList()
}

/**
 * 关闭调查问卷用户答案对话框
 */
const closeSurveyUserAnswerDialog = () => {
  state.surveyUserAnswerDialog.visible = false
  proxy.$resetForm(surveyUserAnswerRuleFormRef.value)
  state.surveyUserAnswerForm = {} as SurveyUserAnswerForm
}

/**
 * 选中数据
 *
 * @param selection 选中数据
 */
const handleSelectionChange = (selection: SurveyUserAnswer[]) => {
  state.answerIds = selection.map((surveyUserAnswer: SurveyUserAnswer) => surveyUserAnswer.answerId)
  if (selection.length === 1) {
    state.answerId = answerIds.value[0]
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
    if (surveyUserAnswerDialog.value.type == 'add') {
      await addSurveyUserAnswer(state.surveyUserAnswerForm)
      proxy.$message.success('添加调查问卷用户答案信息成功')
      closeSurveyUserAnswerDialog()
      await handleList()
    }
    if (surveyUserAnswerDialog.value.type == 'edit') {
      await editSurveyUserAnswer(state.surveyUserAnswerForm)
      proxy.$message.success('修改调查问卷用户答案信息成功')
      closeSurveyUserAnswerDialog()
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
