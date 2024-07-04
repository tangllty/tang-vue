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
      {
        element: 'el-select',
        name: '选择器',
        icon: '选择器',
        label: '选择器',
        placeholder: '请选择选项',
        options: [],
      },
      {
        element: 'el-cascader',
        name: '级联选择',
        icon: '级联选择',
        label: '级联选择',
        placeholder: '请选择选项',
        cascaderOptions: [],
      },
      {
        element: 'pre',
        name: '文本',
        icon: 'text',
        placeholder: '请输入文本',
        text: '文本内容...',
        align: 'left',
      },
      {
        element: 'div',
        name: 'HTML',
        icon: 'code',
        placeholder: '请输入HTML',
        code: '<p>tab <b>html</b> here...</p>'
      }
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
      if (component.label) {
        component.labelWidth = 100
      }
    } else if (containerType.includes(componentGroup.name)) {
      component.type = 'container'
    }
  })

  return componentGroup
})

export const groupNames = componentGroupList.map(item => item.name)
