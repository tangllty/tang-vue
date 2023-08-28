// 默认系统设置
interface DefaultSettings {
  title: string
  sidebarHeader: boolean
  sidebarHeaderLogo: boolean
  fixedHeader: boolean
  sidebar: boolean
}

// 默认系统设置
const defaultSettings: DefaultSettings = {
  title: '权限管理系统',
  sidebarHeader: true,
  sidebarHeaderLogo: true,
  fixedHeader: true,
  sidebar: false
}

export default defaultSettings
