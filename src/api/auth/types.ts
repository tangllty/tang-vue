import { LoginType } from '@/enums'

// 登陆表单对象
export interface LoginForm {
    username: string
    email: string
    password: string
    loginType: LoginType
    captcha: CaptchaForm
}

// 验证码表单对象
export interface CaptchaForm {
    id: number
    text: string
}
