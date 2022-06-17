import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export enum APPEARANCE {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
export interface SettingState {
  locale: string
  appearance: APPEARANCE
  wallpaperColor: string
  customPalette: {
    darkColors: null | Record<string, string>
    lightColors: null | Record<string, string>
  }
  rail: boolean
  quality: number
  cacheLimit: number
  volume: number
  account: Record<string, string>
}
export const useSettingStore = defineStore('setting', {
  state: () => {
    return useLocalStorage<SettingState>('setting', {
      locale: 'en',
      appearance: APPEARANCE.SYSTEM,
      wallpaperColor: 'GreenRockyMountains',
      customPalette: {
        darkColors: null,
        lightColors: null,
      },
      rail: true,
      quality: 320000,
      cacheLimit: 500,
      volume: 0.8,
      account: {},
    })
  },
})