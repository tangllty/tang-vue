import { getDicts } from '@/utils/dict'
import { download } from '@/utils/download'
import { getFullPath } from '@/utils/path'
import webSocketService from '@/utils/websocket'
import contextMenu from '@/components/ContextMenu'
import { resetForm } from '@/utils/form'
import { notImplemented } from '@/utils/notImplemented'
import { copy } from '@/utils/clipboard'
import { sort } from '@/utils/sortChange'

// 在 Vue 实例上扩展自定义属性 https://vuejs.org/guide/typescript/options-api.html#augmenting-global-properties
declare module 'vue' {
  interface ComponentCustomProperties {
    $dict: typeof getDicts
    $download: typeof download
    $path: typeof getFullPath
    $socket: typeof webSocketService
    $contextMenu: typeof contextMenu
    $resetForm: typeof resetForm
    $notImplemented: typeof notImplemented
    $copy: typeof copy
    $sort: typeof sort
  }
}

export {}
