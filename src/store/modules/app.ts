import { defineStore } from 'pinia'
import { store } from '@/store'

export const useAppStore = defineStore('app', () => {
  return {}
})

/**
 * 在非 setup 中使用
 *
 * @returns app store
 */
export const useAppStoreHook = () => {
  return useAppStore(store)
}
