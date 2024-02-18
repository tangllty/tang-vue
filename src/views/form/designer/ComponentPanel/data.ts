import type { Component, ComponentGroup } from '../types'

export const componentGroupList = [
  {
    name: '基础组件',
    list: [
      {
        element: 'el-input',
        icon: '代码生成',
        label: '单行文本',
        placeholder: '请输入单行文本',
        prepend: '',
        append: '',
      },
      {
        element: 'el-input-textarea',
        icon: '代码生成',
        label: '多行文本',
        placeholder: '请输入多行文本',
      },
      {
        element: 'el-input-number',
        icon: '代码生成',
        label: '数字输入框',
        placeholder: '请输入数字输入框',
      },
    ] as Component[]
  },
  // {
  //   name: '布局组件',
  //   list: [
  //     {
  //       element: 'el-row',
  //       label: '行',
  //     },
  //     {
  //       element: 'el-col',
  //       label: '列',
  //     },
  //   ] as Component[]
  // },
] as ComponentGroup[]

export const groupNames = componentGroupList.map(item => item.name)
