import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { SysDictData } from '@/api/system/dict/data/types'

export const useDictStore = defineStore('dict', () => {
  const dict: Ref<Map<string, SysDictData[]>> = ref<Map<string, SysDictData[]>>(new Map())

  function getDict(dictType: string): SysDictData[] | undefined {
    return dict.value.get(dictType)
  }

  function setDict(dictType: string, dictDataList: SysDictData[]): Map<string, SysDictData[]> {
    return dict.value.set(dictType, dictDataList)
  }

  function hasDict(dictType: string): boolean {
    return dict.value.has(dictType)
  }

  function deleteDict(dictType: string): boolean {
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
