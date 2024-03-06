import type { CascaderOption } from 'element-plus/es/components/cascader-panel/src/node'

export interface ComponentGroup {
  name: string
  icon: string
  list: Component[]
}

export interface Component {
  id: string
  element: string
  name: string
  icon: string
  type: 'component' | 'container'
  label?: string
  labelWidth?: number
  vModel?: any
  field?: string
  defaultValue?: string
  placeholder?: string
  options?: { label: string; value: string | number }[]
  cascaderOptions?: CascaderOption[]
  children?: Component[]
  [key: string]: any
}
