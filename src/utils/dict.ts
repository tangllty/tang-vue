import { useDictStore } from '@/store/modules/dict'
import { selectDictDataListByDictType as getDictData } from '@/api/system/dict/data'
import { ref, toRefs } from 'vue'

export function getDicts(...dictTypes: string[]) {
  const dicts: any = ref({})
  const dictStore = useDictStore()

  return (() => {
    dictTypes.forEach((dictType) => {
      dicts.value[dictType] = []
      const hasDict = dictStore.hasDict(dictType)
      if (hasDict) {
        dicts.value[dictType] = dictStore.getDict(dictType)
      } else {
        getDictData(dictType).then(({ data }) => {
          dicts.value[dictType] = data
          dictStore.setDict(dictType, data)
        })
      }
    })
    return toRefs(dicts.value)
  })()
}
