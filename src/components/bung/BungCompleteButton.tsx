'use client'

import { useMutation } from 'react-query'

import { useModalContext } from '@contexts/ModalContext'
import { minting } from '@apis/nfts/minting/api'
import MintingModal from '../nfts/MintingModal'

export default function BungCompleteButton() {
  const { mutate, isLoading } = useMutation(minting, {
    onSuccess: ({ data }) => {
      openModal({
        contents: (
          <MintingModal
            serialNumber={data.nftSerial}
            imageSrc={data.decodedUri}
            rarity={data.decodedMemoData}
            category={data.taxon}
          />
        ),
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
      <span className='text-[16px] text-black font-bold'>{isLoading ? 'NFT 발급 중입니다...' : '참여 완료'}</span>
    </button>
  )
}
