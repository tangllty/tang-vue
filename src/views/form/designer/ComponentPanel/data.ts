import type { Component, ComponentGroup } from '../types'

export const componentGroupList = [
  {
    name: '基础组件',
    icon: '基础组件',
    list: [
      {
        element: 'el-input',
        icon: '单行文本',
        label: '单行文本',
        placeholder: '请输入单行文本',
        prepend: '',
        append: '',
      },
      {
        element: 'el-input-textarea',
        icon: '多行文本',
        label: '多行文本',
        placeholder: '请输入多行文本',
      },
      {
        element: 'el-input-number',
        icon: '数字框',
        label: '数字框',
        placeholder: '请输入数字',
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
