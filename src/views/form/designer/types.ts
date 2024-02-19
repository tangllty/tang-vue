export interface ComponentGroup {
  name: string
  icon: string
  list: Component[]
}

export interface Component {
  element: string
  icon: string
  label: string
  vModel: any
  field: string
  defaultValue?: string
  placeholder?: string
  [key: string]: any
}
