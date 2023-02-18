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
            v-hasPermission="'system:menu:add'"
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
        />
        <el-table-column
          prop="icon"
          label="图标"
          align="center"
        >
          <template #default="scope">
            <svg-icon :name="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="显示顺序"
          align="center"
        />
        <el-table-column
          prop="permission"
          label="权限标识"
          align="center"
        />
        <el-table-column
          prop="component"
          label="组件地址"
          align="center"
        />
        <el-table-column
          label="状态"
          align="center"
          prop="status"
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleChangeStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
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
              v-hasPermission="'system:menu:add'"
              @click="handleAdd(scope.row)"
            >新增</el-button>
            <el-button
              type="primary"
              link
              :icon="Edit"
              size="small"
              v-hasPermission="'system:menu:edit'"
              @click="handleEdit(scope.row)"
            >修改</el-button>
            <el-button
              type="primary"
              link
              :icon="Delete"
              size="small"
              v-hasPermission="'system:menu:delete'"
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
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio label="D">目录</el-radio>
            <el-radio label="M">菜单</el-radio>
            <el-radio label="B">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="menuForm.menuName"
            placeholder="请输入菜单名称"
          />
        </el-form-item>
        <el-form-item label="路由地址" prop="path">
          <el-input
            v-model="menuForm.path"
            placeholder="请输入路由地址, 例: 'menu'"
          />
        </el-form-item>
        <el-form-item
          label="组件路径"
          prop="component"
          v-if="menuForm.menuType === 'M'"
        >
          <el-input
            v-model="menuForm.component"
            placeholder="请输入组件路径, 例: 'system/menu/index'"
          />
        </el-form-item>
        <el-form-item
          label="菜单图标"
          prop="icon"
          v-if="menuForm.menuType !== 'B'"
        >
          <el-popover
            ref="popoverRef"
            placement="bottom-start"
            :width="570"
            trigger="click"
          >
            <template #reference>
              <el-input
                v-model="menuForm.icon"
                placeholder="请选择图标"
                readonly
                @click="iconSelectVisible = true"
              >
                <template #prepend>
                  <svg-icon :name="menuForm.icon" />
                </template>
              </el-input>
            </template>
            <icon-select @selected="selected" />
          </el-popover>
        </el-form-item>
        <el-form-item
          label="权限标识"
          prop="permission"
          v-if="menuForm.menuType === 'B'"
        >
          <el-input
            v-model="menuForm.permission"
            placeholder="请输入权限标识, 例: 'system:menu:list'"
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
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Delete, Search, Refresh } from '@element-plus/icons-vue'
import { listMenu, menuTree as selectMenuTree, addMenu, editMenu, changeStatus, deleteMenu } from '@/api/system/menu'
import { SysMenu, SysMenuForm, SysMenuQuery } from '@/api/system/menu/types'
import IconSelect from '@/components/IconSelect/index.vue'

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
  // Icon选择器显示状态
  iconSelectVisible: false,
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
    parentId: 0,
    menuType: 'D',
    sort: 1
  } as SysMenuForm
})

const {
  loading,
  menuIds,
  menuList,
  menuTree,
  iconSelectVisible,
  queryParams,
  menuDialog,
  menuForm
} = toRefs(state)

const menuRuleFormRef = ref<FormInstance>()
const menuQueryFormRef = ref<FormInstance>()
const menuRules = reactive<FormRules>({
  parentId: [
    { required: true, message: '上级菜单不能为空', trigger: 'blur' },
  ],
  menuType: [
    { required: true, message: '菜单类型不能为空', trigger: 'blur' },
  ],
  menuName: [
    { required: true, message: '菜单名称不能为空', trigger: 'blur' },
    { min: 2, max: 32, message: '菜单名称长度应在 2 到 32 之间', trigger: 'blur' },
  ],
  path: [
    { required: true, message: '路由地址不能为空', trigger: 'blur' },
  ],
  component: [
    { required: true, message: '组件路径不能为空', trigger: 'blur' },
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
  const menuTrees: any[] = []
  selectMenuTree().then((res:any) => {
    const menuTree = { value: 0, label: '顶级菜单', children: res.data }
    menuTrees.push(menuTree)
    state.menuTree = menuTrees
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

// 修改菜单状态
function handleChangeStatus(row: SysMenu) {
  const text = row.status === '0' ? '启用' : '停用';
  ElMessageBox.confirm('确认要' + text + '"' + row.menuName + '"菜单吗?', '警告', {
      type: 'warning'
    }
  ).then(() => {
    return changeStatus(row.menuId, row.status)
  }).then(() => {
    ElMessage.success(text + '成功')
  }).catch(() => {
    row.status = row.status === '1' ? '0' : '1'
  })
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

// 选择图标后事件
 function selected(name: string) {
  state.menuForm.icon = name
  state.iconSelectVisible = false
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
