<template>
  <!-- 导入代码生成信息对话框 -->
  <el-dialog
    :title="editTableDialog.title"
    v-model="editTableDialog.visible"
    width="85%"
    @close="closeEditTableDialog"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="tableInfo" >
        <el-form
          ref="editTableRuleFormRef"
          :model="editTableForm"
          :rules="editTableRules"
          label-width="120px"
          status-icon
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="表名称" prop="tableName">
                <el-input
                  v-model="editTableForm.tableName"
                  placeholder="请输入表名称"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="表描述" prop="tableComment">
                <el-input
                  v-model="editTableForm.tableComment"
                  placeholder="请输入表描述"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实体类名称" prop="className">
                <el-input
                  v-model="editTableForm.className"
                  placeholder="请输入实体类名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="包路径" prop="packageName">
                <el-input
                  v-model="editTableForm.packageName"
                  placeholder="请输入包路径"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="模块名" prop="moduleName">
                <el-input
                  v-model="editTableForm.moduleName"
                  placeholder="请输入模块名"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业务名" prop="businessName">
                <el-input
                  v-model="editTableForm.businessName"
                  placeholder="请输入业务名"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类注释" prop="classComment">
                <el-input
                  v-model="editTableForm.classComment"
                  placeholder="请输入类注释"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="作者" prop="author">
                <el-input
                  v-model="editTableForm.author"
                  placeholder="请输入作者"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级菜单" prop="parentMenuId">
                <el-tree-select
                  v-model="editTableForm.parentMenuId"
                  :data="menuTree"
                  check-strictly
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="语言类型" prop="languageType">
                <el-select
                  v-model="editTableForm.languageType"
                  placeholder="请选择语言类型"
                >
                  <el-option label="Java" value="Java" />
                  <el-option label="Kotlin" value="Kotlin" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="ORM 类型" prop="ormType">
                <el-select
                  v-model="editTableForm.ormType"
                  placeholder="请选择 ORM 类型"
                >
                  <el-option label="MyBatis" value="MyBatis" />
                  <el-option label="MyBatis-Plus" value="MyBatis-Plus" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="editTableForm.remark"
                  placeholder="请输入备注"
                  rows="3"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="字段信息" name="tableColumnInfo" >
        <el-table
          v-loading="loading"
          :data="tableColumnList"
          row-key="columnId"
        >
          <el-table-column
            prop="columnName"
            label="字段名称"
            align="center"
            min-width="65px"
            show-overflow-tooltip
          />
          <el-table-column
            prop="columnComment"
            label="字段描述"
            align="center"
            min-width="65px"
          >
            <template #default="scope">
              <el-input
                v-model="scope.row.columnComment"
                placeholder="请输入字段描述"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="columnType"
            label="字段类型"
            align="center"
            min-width="65px"
            show-overflow-tooltip
          />
          <el-table-column
            prop="javaType"
            label="JAVA类型"
            align="center"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.javaType"
                placeholder="请选择JAVA类型"
              >
                <el-option label="String" value="String" />
                <el-option label="Integer" value="Integer" />
                <el-option label="Long" value="Long" />
                <el-option label="LocalDateTime" value="LocalDateTime" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="javaField"
            label="JAVA属性"
            align="center"
          >
            <template #default="scope">
              <el-input
                v-model="scope.row.javaField"
                placeholder="请输入JAVA属性"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="isPk"
            label="主键"
            align="center"
            width="55px"
          >
            <template #default="scope">
              <el-tag
                v-if="scope.row.isPk === '1'"
                type="success"
              >是</el-tag>
              <el-tag
                v-else
                type="danger"
              >否</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="isIncrement"
            label="自增"
            align="center"
            width="55px"
          >
            <template #default="scope">
              <el-tag
                v-if="scope.row.isPk === '1'"
                type="success"
              >是</el-tag>
              <el-tag
                v-else
                type="danger"
              >否</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="isRequired"
            label="必填"
            align="center"
            width="55px"
          >
            <template #default="scope">
              <el-tag
                v-if="scope.row.isPk === '1'"
                type="success"
              >是</el-tag>
              <el-tag
                v-else
                type="danger"
              >否</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="isInsert"
            label="新增"
            align="center"
            width="55px"
          >
            <template #default="scope">
              <el-checkbox
                v-model="scope.row.isInsert"
                true-label="1"
                false-label="0"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="isEdit"
            label="编辑"
            align="center"
            width="55px"
          >
            <template #default="scope">
              <el-checkbox
                v-model="scope.row.isEdit"
                true-label="1"
                false-label="0"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="isList"
            label="列表"
            align="center"
            width="55px"
          >
            <template #default="scope">
              <el-checkbox
                v-model="scope.row.isList"
                true-label="1"
                false-label="0"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="queryType"
            label="查询方式"
            align="center"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.queryType"
                placeholder="请选择查询方式"
              >
                <el-option label="等于" value="equal" />
                <el-option label="模糊" value="fuzzy" />
                <el-option label="包含" value="findInSet" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="htmlType"
            label="HTML类型"
            align="center"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.htmlType"
                placeholder="请选择HTML类型"
              >
                <el-option label="文本框" value="input" />
                <el-option label="数字框" value="number" />
                <el-option label="文本域" value="textarea" />
                <el-option label="单选框" value="radio" />
                <el-option label="复选框" value="checkbox" />
                <el-option label="下拉框" value="select" />
                <el-option label="日期选择框" value="date" />
                <el-option label="日期时间选择框" value="datetime" />
                <el-option label="图片上传" value="image" />
                <el-option label="文件上传" value="file" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="dictType"
            label="字典类型"
            align="center"
          >
            <template #default="scope">
              <el-input
                v-model="scope.row.dictType"
                placeholder="请输入字典类型"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button
        type="primary"
        @click="submitForm(editTableRuleFormRef)"
      >确 定</el-button>
      <el-button
        @click="closeEditTableDialog"
      >取 消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { getProxy } from '@/utils/getCurrentInstance'
import { getGenTable, editGenTable } from '@/api/tool/generator'
import type { GenTableForm, GenTableColumn } from '@/api/tool/generator/types'
import { listMenuTree } from '@/api/system/menu'
import type { SysMenuQuery } from '@/api/system/menu/types'

const proxy = getProxy()

const state = reactive({
  loading: false,
  activeName: 'tableInfo',
  // 字段数据
  tableColumnList: [] as GenTableColumn[],
  // 菜单树数据
  menuTree: [] as TreeSelect[],
  // 对话框
  editTableDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  // 表单
  editTableForm: {} as GenTableForm
})

const {
  loading,
  activeName,
  tableColumnList,
  menuTree,
  editTableDialog,
  editTableForm
} = toRefs(state)

const editTableRuleFormRef = ref<FormInstance>()
const editTableRules = reactive<FormRules>({
  tableName: [
    { required: true, message: '表名称不能为空', trigger: 'blur' },
  ],
  tableComment: [
    { required: true, message: '表描述不能为空', trigger: 'blur' },
  ],
  className: [
    { required: true, message: '实体类名称不能为空', trigger: 'blur' },
  ],
  packageName: [
    { required: true, message: '包路径不能为空', trigger: 'blur' },
  ],
  moduleName: [
    { required: true, message: '模块名不能为空', trigger: 'blur' },
  ],
  businessName: [
    { required: true, message: '业务名不能为空', trigger: 'blur' },
  ],
  classComment: [
    { required: true, message: '类注释不能为空', trigger: 'blur' },
  ],
  author: [
    { required: true, message: '作者不能为空', trigger: 'blur' },
  ],
  parentMenuId: [
    { required: true, message: '上级菜单不能为空', trigger: 'blur' },
  ],
  languageType: [
    { required: true, message: '语言类型不能为空', trigger: 'blur' },
  ],
  ormType: [
    { required: true, message: 'ORM 类型不能为空', trigger: 'blur' },
  ],
})

// 查询代码生成列表
const handleEditTable = async (tableId: number) => {
  const res: any = await getGenTable(tableId)
  state.activeName = 'tableInfo'
  state.editTableDialog.title = '编辑[' + res.data.table.tableName + ']表代码生成信息'
  state.editTableForm = res.data.table
  state.tableColumnList = res.data.tableColumn
}

// 查询菜单树
const getMenuTree = async () => {
  const menuTrees: TreeSelect[] = []
  const res: any = await listMenuTree({menuType: 'D'} as SysMenuQuery)
  const menuTree = { value: 0, label: '顶级菜单', children: res.data } as TreeSelect
  menuTrees.push(menuTree)
  state.menuTree = menuTrees
}

// 显示对话框
const handleShow = async (tableId: number) => {
  state.editTableDialog = {
    title: '编辑[]表代码生成信息',
    type: 'edit',
    visible: true
  }
  state.tableColumnList = []

  await handleEditTable(tableId)
  await getMenuTree()
}

// 关闭对话框
const closeEditTableDialog = () => {
  state.editTableDialog.visible = false
  proxy.$resetForm(editTableRuleFormRef.value)
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  try {
    await formEl.validate()
    state.editTableForm.tableColumnList = state.tableColumnList
    if (editTableDialog.value.type == 'edit') {
      await editGenTable(state.editTableForm)
      proxy.$message.success('修改字典数据信息成功')
      closeEditTableDialog()
      proxy.$emit('submitted')
    }
  } catch (error) {
    console.log('error submit!', error)
  }
}

defineExpose({
  handleShow
})
</script>

<style lang="scss" scoped>
</style>
