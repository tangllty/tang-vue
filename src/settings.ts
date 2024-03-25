/**
 * 默认系统设置
 */
interface DefaultSettings {
  sidebarHeader: boolean
  sidebarHeaderLogo: boolean
  fixedHeader: boolean
  sidebar: boolean
  language: string
  size: string
}

/**
 * 默认系统设置
 */
const defaultSettings: DefaultSettings = {
  sidebarHeader: true,
  sidebarHeaderLogo: true,
  fixedHeader: true,
  sidebar: false,
  language: 'zh-cn',
  size: 'default'
}

export default defaultSettings
