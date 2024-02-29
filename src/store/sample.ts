import { create } from 'zustand'

type Count = {
  count: number
  increase: () => void
}

export const useCount = create<Count>()(set => ({
  count: 1,
  increase: () => set(state => ({ count: state.count + 1 })),
}))
