import { getDicts } from '@/utils/dict'
import { download } from '@/utils/download'
import { getFullPath } from '@/utils/path'
import webSocketService from '@/utils/websocket'
import i18n from '@/locales'
import contextMenu from '@/components/ContextMenu'
import { resetForm } from '@/utils/form'
import { notImplemented } from '@/utils/notImplemented'
import { copy } from '@/utils/clipboard'

// 在 Vue 实例上扩展自定义属性 https://vuejs.org/guide/typescript/options-api.html#augmenting-global-properties
declare module 'vue' {
  interface ComponentCustomProperties {
    // ElementPlus
    $message: typeof import('element-plus')['ElMessage']
    $notify: typeof import('element-plus')['ElNotification']
    $msgbox: typeof import('element-plus')['ElMessageBox']
    $messageBox: typeof import('element-plus')['ElMessageBox']
    $alert: typeof import('element-plus')['ElMessageBox']['alert']
    $confirm: typeof import('element-plus')['ElMessageBox']['confirm']
    $prompt: typeof import('element-plus')['ElMessageBox']['prompt']
    $loading: typeof import('element-plus')['ElLoadingService']

    // TangVue
    $dict: typeof getDicts
    $download: typeof download
    $path: typeof getFullPath
    $socket: typeof webSocketService
    $t: typeof i18n.global.t
    $contextMenu: typeof contextMenu
    $resetForm: typeof resetForm
    $notImplemented: typeof notImplemented
    $copy: typeof copy
  }
}

export {}
