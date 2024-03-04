import type { Component, ComponentGroup } from '../types'

export const componentGroupList = ([
  {
    name: '基础组件',
    icon: '基础组件',
    list: [
      {
        element: 'el-input',
        name: '单行文本',
        icon: '单行文本',
        label: '单行文本',
        placeholder: '请输入单行文本',
        prepend: '',
        append: '',
        prefix: '',
        suffix: '',
      },
      {
        element: 'el-input-textarea',
        name: '多行文本',
        icon: '多行文本',
        label: '多行文本',
        placeholder: '请输入多行文本',
      },
      {
        element: 'el-input-number',
        name: '数字框',
        icon: '数字框',
        label: '数字框',
        placeholder: '请输入数字',
      },
    ] as Component[]
  },
  {
    name: '布局容器',
    icon: '布局容器',
    list: [
      {
        element: 'el-row',
        name: '行容器',
        icon: '行容器',
        children: [] as Component[],
      },
    ] as Component[]
  },
] as ComponentGroup[]).map(componentGroup => {
  const componentType = ['基础组件']
  const containerType = ['布局容器']

  componentGroup.list.forEach(component => {
    if (componentType.includes(componentGroup.name)) {
      component.type = 'component'
    } else if (containerType.includes(componentGroup.name)) {
      component.type = 'container'
    }
  })

  return componentGroup
})

export const groupNames = componentGroupList.map(item => item.name)
