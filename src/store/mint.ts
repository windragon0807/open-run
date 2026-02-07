import { create } from 'zustand'
import { ApiResponse } from '@apis/type'
import { mintNFT } from '@apis/v1/nft/mint'

type MintResult = {
  tokenId: number
  name: string
  description: string
  image: string
  category: string
  rarity: string
}

type MintStatus = 'idle' | 'pending' | 'success' | 'error'

type MintStore = {
  status: MintStatus
  result: ApiResponse<MintResult> | null
  startMint: (challengeId: number) => void
  reset: () => void
}

export const useMintStore = create<MintStore>()((set, get) => ({
  status: 'idle',
  result: null,

  startMint: (challengeId: number) => {
    if (get().status === 'pending') return

    set({ status: 'pending', result: null })

    mintNFT({ challengeId })
      .then((data) => {
        set({ status: 'success', result: data })
      })
      .catch(() => {
        set({ status: 'error', result: null })
      })
  },

  reset: () => set({ status: 'idle', result: null }),
}))
