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
  label?: string
  vModel?: any
  field?: string
  defaultValue?: string
  placeholder?: string
  children?: Component[]
  [key: string]: any
}
