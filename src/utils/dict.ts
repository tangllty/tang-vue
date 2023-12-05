import { ref, ToRefs, toRefs } from 'vue'
import { useDictStore } from '@/store/modules/dict'
import { selectDictDataListByDictType as getDictData } from '@/api/system/dict/data'

/**
 * 字典数据类型
 */
type Dicts = { [key: string]: any }

/**
 * 获取字典数据
 *
 * @param dictTypes 字典类型
 * @returns 字典数据
 */
export const getDicts = (...dictTypes: string[]): ToRefs<Dicts> => {
  const dicts = ref<Dicts>({})
  const dictStore = useDictStore()

  /**
   * 获取字典数据
   *
   * @param dictType 字典类型
   */
  const fetchDictData = async (dictType: string) => {
    const res: any = await getDictData(dictType)
    dicts.value[dictType] = res.data
    dictStore.setDict(dictType, res.data)
  }

  dictTypes.forEach((dictType: string) => {
    dicts.value[dictType] = []
    const hasDict: boolean = dictStore.hasDict(dictType)
    if (hasDict) {
      dicts.value[dictType] = dictStore.getDict(dictType)
    } else {
      fetchDictData(dictType)
    }
  })

  return toRefs(dicts.value)
}
