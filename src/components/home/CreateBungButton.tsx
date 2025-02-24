'use client'

import { ReactNode } from 'react'

import { useModalContext } from '@contexts/ModalContext'
import PlusIcon from '@icons/PlusIcon'
import { colors } from '@styles/colors'
import CreateBung from './create-bung/CreateBung'

export default function CreateBungButton({ children }: { children?: ReactNode }) {
  const { openModal } = useModalContext()
  return (
    <button
      className='mx-auto flex w-full max-w-[500px] items-center justify-center gap-8 rounded-8 border border-dashed border-black-default py-12'
      onClick={() => {
        openModal({ contents: <CreateBung /> })
      }}>
      <span className='text-black-default'>{children}</span>
      <PlusIcon size={16} color={colors.black.darken} />
    </button>
  )
}
