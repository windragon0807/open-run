import { create } from 'zustand'

type App = {
  isApp: boolean
  setIsApp: (isApp: boolean) => void
}

export const useAppStore = create<App>()((set) => ({
  isApp: false,
  setIsApp: (isApp: boolean) => set(() => ({ isApp })),
}))
