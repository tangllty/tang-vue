import { useDictStore } from '@/store/modules/dict'
import { selectDictDataListByDictType as getDictData } from '@/api/system/dict/data'
import { ref, ToRefs, toRefs } from 'vue'

export function getDicts(...dictTypes: string[]): ToRefs<any> {
  const dicts: any = ref({})
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
