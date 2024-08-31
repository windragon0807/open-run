'use client'

import { useModalContext } from '@contexts/ModalContext'
import MintingModal from '../nfts/MintingModal'

export default function BungCompleteButton() {
  const { openModal } = useModalContext()
  return (
    <button
      className='w-full h-56 rounded-8 bg-secondary flex items-center justify-center'
      onClick={() => {
        openModal({
          contents: <MintingModal />,
        })
      }}>
      <span className='text-[16px] text-black font-bold'>참여 완료</span>
    </button>
  )
}
