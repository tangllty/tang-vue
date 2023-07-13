import { getDicts } from '@/utils/dict'
import { download } from '@/utils/download'

// 在 Vue 实例上扩展自定义属性
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dict: getDicts
    $download: download
  }
}

export {}
