import type { EpPropMergeType } from 'element-plus/es/utils/vue/props/types'

// Element 大小类型
export type ElementPlusSize = EpPropMergeType<StringConstructor, '' | 'default' | 'small' | 'large', never>

export type TagType = EpPropMergeType<StringConstructor, 'success' | 'warning' | 'info' | 'danger', unknown>

