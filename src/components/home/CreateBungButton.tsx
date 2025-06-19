'use client'

import { ReactNode } from 'react'
import { useModal } from '@contexts/ModalProvider'
import PlusIcon from '@icons/PlusIcon'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'
import CreateBung from './create-bung/CreateBung'

export default function CreateBungButton({ children }: { children?: ReactNode }) {
  const { showModal } = useModal()
  return (
    <button
      className='border-black mx-auto flex w-full max-w-[500px] items-center justify-center gap-8 rounded-8 border border-dashed py-12'
      onClick={() => {
        showModal({ key: MODAL_KEY.CREATE_BUNG, component: <CreateBung /> })
      }}>
      <span className='text-black'>{children}</span>
      <PlusIcon size={16} color={colors.black.darken} />
    </button>
  )
}
