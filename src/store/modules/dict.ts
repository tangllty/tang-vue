import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { store } from '@/store'
import type { SysDictData } from '@/api/system/dict/data/types'

export const useDictStore = defineStore('dict', () => {
  const dict: Ref<Map<string, SysDictData[]>> = ref<Map<string, SysDictData[]>>(new Map())

  /**
   * 获取字典
   *
   * @param dictType 字典类型
   * @returns 字典数据
   */
  const getDict = (dictType: string): SysDictData[] | undefined => {
    return dict.value.get(dictType)
  }

  /**
   * 设置字典
   *
   * @param dictType 字典类型
   * @param dictDataList 字典数据
   * @returns 字典数据
   */
  const setDict = (dictType: string, dictDataList: SysDictData[]): Map<string, SysDictData[]> => {
    return dict.value.set(dictType, dictDataList)
  }

  /**
   * 是否存在字典
   *
   * @param dictType 字典类型
   * @returns 是否存在字典
   */
  const hasDict = (dictType: string): boolean => {
    return dict.value.has(dictType)
  }

  /**
   * 删除字典
   *
   * @param dictType 字典类型
   * @returns 是否删除成功
   */
  const deleteDict = (dictType: string): boolean => {
    return dict.value.delete(dictType)
  }

  return {
    dict,
    getDict,
    setDict,
    hasDict,
    deleteDict
  }
})

/**
 * 在非 setup 中使用
 *
 * @returns dict store
 */
export const useDictStoreHook = () => {
  return useDictStore(store)
}
