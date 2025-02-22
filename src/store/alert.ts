import { create } from 'zustand'

interface AlertOptions {
  title?: string
  description: string
}

interface AlertStore {
  isOpen: boolean
  title?: string
  description: string
  openAlert: (options: AlertOptions) => void
  closeAlert: () => void
}

export const useAlertStore = create<AlertStore>((set) => ({
  isOpen: false,
  title: undefined,
  description: '',
  openAlert: (options: AlertOptions) => set({ isOpen: true, title: options.title, description: options.description }),
  closeAlert: () => set({ isOpen: false }),
}))
