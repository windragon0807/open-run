'use client'

import { useEffect, useCallback } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { useMintStore } from '@store/mint'
import { Rarity } from '@type/avatar'
import { MODAL_KEY } from '@constants/modal'
import ToastModal from '@shared/ToastModal'
import RewardsModal from './RewardsModal'

export default function MintListener() {
  const { showModal } = useModal()
  const status = useMintStore((state) => state.status)
  const result = useMintStore((state) => state.result)
  const reset = useMintStore((state) => state.reset)

  const showRewardsModal = useCallback(() => {
    const data = useMintStore.getState().result?.data
    if (!data) return

    showModal({
      key: MODAL_KEY.REWARD,
      component: (
        <RewardsModal
          serialNumber={String(data.tokenId).padStart(5, '0')}
          imageSrc={data.image}
          rarity={data.rarity as Rarity}
          name={data.name}
          category={data.category}
        />
      ),
    })
    reset()
  }, [showModal, reset])

  useEffect(() => {
    if (status === 'success' && result) {
      showModal({
        key: MODAL_KEY.TOAST,
        component: (
          <ToastModal
            mode='success'
            message='NFT 발급 완료!'
            actionLabel='확인'
            onAction={showRewardsModal}
          />
        ),
      })
    }
  }, [status, result, showModal, showRewardsModal])

  return null
}
