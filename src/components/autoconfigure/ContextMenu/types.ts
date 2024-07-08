export interface ContextMenuInstance {
  id: number
  destroy: () => void
}

export interface ContextMenuProps {
  options: ContextMenuOptions
  onClose?: () => void
}

export interface ContextMenuOptions {
  items: MenuItem[]
  theme?: string
  onClose?: () => void
}

export interface MenuItem {
  label?: string
  icon?: string
  disabled?: boolean
  visible?: boolean
  divided?: boolean
  children?: MenuItem[]
  onClick?: () => void
}

