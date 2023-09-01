import { getDicts } from '@/utils/dict'
import { download } from '@/utils/download'
import { getFullPath } from '@/utils/path'
import webSocketService from '@/utils/websocket'
import i18n from './locales'

// 在 Vue 实例上扩展自定义属性
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dict: getDicts
    $download: download
    $path: getFullPath
    $socket: typeof webSocketService
    $t: typeof i18n.global.t
  }
}

export {}
