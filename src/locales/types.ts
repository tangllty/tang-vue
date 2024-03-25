export type languages = {
  key: string,
  title: string,
  sort: number
}

export type language = {
  title: string
  sort: number
  lang: {
    title: string,
    login: {
      title: string,
      submit: string
      reset: string
      loginType: {
        username: string
        email: string
      }
      username: string
      usernamePlaceholder: string
      password: string
      passwordPlaceholder: string
      email: string
      emailPlaceholder: string
      captcha: string
      captchaPlaceholder: string
    },
    layout: {
      profile: string
      documentation: string
      settings: string
      logout: string
      logoutConfirm: {
        message: string
        title: string
      }
    },
    size: {
      large: string
      default: string
      small: string
    },
    settings: {
      title: string
      basic: {
        title: string
        theme: string
      },
      sidebar: {
        title: string
        showHeader: string
        showLogo: string
        fixedHeader: string
      }
    }
  }
}
