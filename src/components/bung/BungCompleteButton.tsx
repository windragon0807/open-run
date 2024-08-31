'use client'

import { useMutation } from 'react-query'

import { useModalContext } from '@contexts/ModalContext'
import { minting } from '@apis/nfts/minting/api'
import MintingModal from '../nfts/MintingModal'

export default function BungCompleteButton() {
  const { mutate } = useMutation(minting, {
    onSuccess: (data) => {
      console.log('ryong', data)
      openModal({
        contents: <MintingModal />,
      })
    },
  })
  const { openModal } = useModalContext()

  return (
    <button
      className='w-full h-56 rounded-8 bg-secondary flex items-center justify-center'
      onClick={() => {
        mutate()
      }}>
      <span className='text-[16px] text-black font-bold'>참여 완료</span>
    </button>
  )
}
