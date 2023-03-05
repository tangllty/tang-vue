import { useDictStore } from '@/store/modules/dict'
import { selectDictDataListByDictType as getDictData } from '@/api/system/dict/data'
import { toRefs } from 'vue'

export function getDicts(...dictTypes: string[]) {
  const dicts: any = {}
  const dictStore = useDictStore()

  dictTypes.forEach((dictType) => {
    dicts[dictType] = []
    const hasDict = dictStore.hasDict(dictType)
    if (hasDict) {
      dicts[dictType] = dictStore.getDict(dictType)
    } else {
      getDictData(dictType).then(({ data }) => {
        dicts[dictType] = data
        dictStore.setDict(dictType, data)
      })
    }
  })
  return toRefs(dicts)
}
