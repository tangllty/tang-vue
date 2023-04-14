import { Ref, ref, ToRefs, toRefs } from 'vue'
import { useDictStore } from '@/store/modules/dict'
import { selectDictDataListByDictType as getDictData } from '@/api/system/dict/data'

export const getDicts = (...dictTypes: string[]): ToRefs => {
  const dicts: Ref = ref({})
  const dictStore = useDictStore()

  return (() => {
    dictTypes.forEach((dictType: string): void => {
      dicts.value[dictType] = []
      const hasDict: boolean = dictStore.hasDict(dictType)
      if (hasDict) {
        dicts.value[dictType] = dictStore.getDict(dictType)
      } else {
        getDictData(dictType).then(({ data }): void => {
          dicts.value[dictType] = data
          dictStore.setDict(dictType, data)
        })
      }
    })
    return toRefs(dicts.value)
  })()
}
