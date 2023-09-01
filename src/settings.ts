// 默认系统设置
interface DefaultSettings {
  title: string
  sidebarHeader: boolean
  sidebarHeaderLogo: boolean
  fixedHeader: boolean
  sidebar: boolean
  language: string
}

// 默认系统设置
const defaultSettings: DefaultSettings = {
  title: '权限管理系统',
  sidebarHeader: true,
  sidebarHeaderLogo: true,
  fixedHeader: true,
  sidebar: false,
  language: 'zh-cn'
}

export default defaultSettings
