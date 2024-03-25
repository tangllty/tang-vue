import { language } from '../types'

// 简体中文
const zhCN: language = {
  title: '简体中文',
  sort: 1,
  lang: {
    title: '权限管理系统',
    login: {
      title: '糖猫猫权限管理系统',
      submit: '登录',
      reset: '重置',
      loginType: {
        username: '用户名密码',
        email: '邮箱密码',
      },
      username: '用户名',
      usernamePlaceholder: '请输入用户名',
      password: '密码',
      passwordPlaceholder: '请输入密码',
      email: '邮箱',
      emailPlaceholder: '请输入邮箱',
      captcha: '验证码',
      captchaPlaceholder: '请输入验证码',
    },
    layout: {
      profile: '个人中心',
      documentation: '文档',
      settings: '系统设置',
      logout: '退出登录',
      logoutConfirm: {
        message: '确定注销并退出系统吗？',
        title: '提示',
      }
    },
    size: {
      large: '大',
      default: '默认',
      small: '小',
    },
    settings: {
      title: '系统设置',
      basic: {
        title: '基础设置',
        theme: '主题设置',
      },
      sidebar: {
        title: '侧边栏设置',
        showHeader: '显示顶部栏',
        showLogo: '侧边栏展开时显示 LOGO',
        fixedHeader: '固定顶部栏',
      }
    }
  }
}

export default zhCN
