<template>
  <div>
    <!-- 信息检索 -->
    <el-card style="margin-bottom: 10px;">
      <el-form ref="menuQueryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="queryParams.menuName"
            placeholder="菜单名称"
            style="width: 200px"
            @keyup.enter="handleList"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input
            v-model="queryParams.status"
            placeholder="状态"
            style="width: 200px"
            @keyup.enter="handleList"
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

    <!-- 菜单数据 -->
    <el-card>

      <!-- 菜单操作 -->
      <template #header>
        <el-row class="mb-8">
          <el-button
            type="primary"
            :icon="Plus"
            @click="handleAdd"
          >新增</el-button>

        </el-row>
      </template>

      <!-- 菜单表格 -->
      <el-table
        v-loading="loading"
        :data="menuList"
        row-key="menuId"
        lazy
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          prop="menuName"
          label="菜单名称"
          align="center"
        />
        <el-table-column
          prop="sort"
          label="显示顺序"
          align="center"
        />
        <el-table-column
          prop="status"
          label="状态"
          align="center"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
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
              :icon="Plus"
              size="small"
              @click="handleAdd(scope.row)"
            >新增</el-button>
            <el-button
              type="primary"
              link
              :icon="Edit"
              size="small"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              type="primary"
              link
              :icon="Delete"
              size="small"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加或修改菜单信息对话框 -->
    <el-dialog
      :title="menuDialog.title"
      v-model="menuDialog.visible"
      @close="closeUserDialog"
    >
      <el-form
      ref="menuRuleFormRef"
      :model="menuForm"
      :rules="menuRules"
      label-width="120px"
      status-icon
      >
        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select
            v-model="menuForm.parentId"
            :data="menuTree"
            :render-after-expand="false"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="menuForm.menuName"
            placeholder="请输入菜单名称"
          />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number
            v-model="menuForm.sort"
            :min="1"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitForm(menuRuleFormRef)"
          >确 定</el-button>
          <el-button
            @click="closeUserDialog"
          >取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { listMenu, menuTree as selectMenuTree, getMenu, addMenu, editMenu, deleteMenu } from '@/api/system/menu'
import { SysMenu, SysMenuForm, SysMenuQuery } from '@/api/system/menu/types'

const state = reactive({
  // 遮罩层
  loading: false,
  // 选中数据
  menuId: 0 as number,
  // 选中数据数组
  menuIds: [] as number[],
  // 菜单数据
  menuList: [] as SysMenu[],
  // 菜单树数据
  menuTree: [] as TreeSelect[],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10
  } as SysMenuQuery,
  // 对话框
  menuDialog: {
    title: '',
    type: '',
    visible: false
  } as Dialog,
  // 表单
  menuForm: {
    sort: 1
  } as SysMenuForm
})

const {
  loading,
  menuIds,
  menuList,
  menuTree,
  queryParams,
  menuDialog,
  menuForm
} = toRefs(state)

const menuRuleFormRef = ref<FormInstance>()
const menuQueryFormRef = ref<FormInstance>()
const menuRules = reactive<FormRules>({
  menuName: [
    { required: true, message: '菜单名称不能为空', trigger: 'blur' },
    { min: 2, max: 32, message: '菜单名称长度应在 2 到 32 之间', trigger: 'blur' },
  ],
})

// 查询菜单列表
function handleList() {
  state.loading = true
  listMenu(state.queryParams).then((res:any) => {
    state.menuList = res.data
    state.loading = false
  })
}

// 查询菜单树
function getMenuTree() {
  selectMenuTree().then((res:any) => {
    state.menuTree = res.data
  })
}

// 添加菜单信息
function handleAdd(row: any) {
  getMenuTree()
  state.menuForm.parentId = row.menuId
  state.menuDialog = {
    title: '新增菜单信息',
    type: 'add',
    visible: true
  }
}

// 修改菜单信息
function handleEdit(row: any) {
  getMenuTree()
  state.menuForm = row
  state.menuDialog = {
    title: '修改菜单信息',
    type: 'edit',
    visible: true
  }
}

// 删除菜单信息
function handleDelete(row: any) {
  deleteMenu(row.menuId).then(() => {
    ElMessage.success("删除菜单信息成功")
    handleList()
  })
}

// 重置表单
function resetQuery() {
  menuQueryFormRef.value?.resetFields()
  handleList()
}

// 关闭对话框
function closeUserDialog() {
  state.menuDialog.visible = false
  menuRuleFormRef.value?.clearValidate()
  menuRuleFormRef.value?.resetFields()
}

// 多选框
function handleSelectionChange(selection: any) {
  state.menuIds = selection.map((item: any) => item.menuId)
  if (selection.length === 1) {
    state.menuId = menuIds.value[0]
  }
}

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (menuDialog.value.type == 'add') {
        addMenu(state.menuForm).then(() => {
          ElMessage.success("添加菜单信息成功")
          closeUserDialog()
          handleList()
        })
      }
      if (menuDialog.value.type == 'edit') {
        editMenu(state.menuForm).then(() => {
          ElMessage.success("修改菜单信息成功")
          closeUserDialog()
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
