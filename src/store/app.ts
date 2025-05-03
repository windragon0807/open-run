import { create } from 'zustand'
import { Message } from '@type/app'

type Theme = {
  isApp: boolean
  setApp: (isApp: boolean) => void

  message: Message
  setMessage: (message: Message) => void
}

export const useAppStore = create<Theme>()((set) => ({
  isApp: false,
  setApp: (isApp: boolean) => set(() => ({ isApp })),

  message: {},
  setMessage: (message: Message) => set(() => ({ message })),
}))
