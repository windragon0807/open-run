'use client'

import { ReactNode } from 'react'

import { useModalContext } from '@contexts/ModalContext'
import PlusIcon from '@icons/PlusIcon'
import CreateBung from './create-bung/CreateBung'

export default function CreateBungButton({ children }: { children?: ReactNode }) {
  const { openModal } = useModalContext()
  return (
    <button
      className='w-full max-w-[500px] mx-auto rounded-8 border border-dashed border-black-default py-12 flex gap-8 justify-center items-center'
      onClick={() => {
        openModal({ contents: <CreateBung /> })
      }}>
      <span className='text-black-default'>{children}</span>
      <PlusIcon />
    </button>
  )
}
