// 默认系统设置
interface DefaultSettings {
  loginTitle: string
  title: string
  sidebarHeader: boolean
  sidebarHeaderLogo: boolean
  fixedHeader: boolean
  sidebar: boolean
  language: string
  size: string
}

// 默认系统设置
const defaultSettings: DefaultSettings = {
  loginTitle: '糖猫猫权限管理系统',
  title: '权限管理系统',
  sidebarHeader: true,
  sidebarHeaderLogo: true,
  fixedHeader: true,
  sidebar: false,
  language: 'zh-cn',
  size: 'default'
}

export default defaultSettings
