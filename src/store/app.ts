import { create } from 'zustand'

type App = {
  isApp: boolean
  setApp: (isApp: boolean) => void
}

export const useAppStore = create<App>()((set) => ({
  isApp: false,
  setApp: (isApp: boolean) => set(() => ({ isApp })),
}))
