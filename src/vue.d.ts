import { getDicts } from '@/utils/dict'
import { download } from '@/utils/download'
import { getFullPath } from '@/utils/path'

// 在 Vue 实例上扩展自定义属性
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dict: getDicts
    $download: download
    $path: getFullPath
  }
}

export {}
