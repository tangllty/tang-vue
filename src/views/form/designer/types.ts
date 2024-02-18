export interface ComponentGroup {
  name: string
  list: Component[]
}

export interface Component {
  element: string
  icon: string
  label: string
  vModel: string
  field: string
  defaultValue?: string
  placeholder?: string
  [key: string]: any
}
