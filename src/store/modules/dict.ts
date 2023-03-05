import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SysDictData } from '@/api/system/dict/data/types'

export const useDictStore = defineStore('dict', () => {
  const dict = ref<Map<string, SysDictData[]>>(new Map())

  function getDict(dictType: string) {
    return dict.value.get(dictType)
  }

  function setDict(dictType: string, dictDataList: SysDictData[]) {
    return dict.value.set(dictType, dictDataList)
  }

  function hasDict(dictType: string) {
    return dict.value.has(dictType)
  }

  function deleteDict(dictType: string) {
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
