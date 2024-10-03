'use client'

import { ReactNode } from 'react'

import { useModalContext } from '@contexts/ModalContext'
import PlusIcon from '@icons/PlusIcon'
import CreateBung from './create-bung/CreateBung'

export default function CreateBungButton({ children }: { children?: ReactNode }) {
  const { openModal } = useModalContext()
  return (
    <button
      className='w-full max-w-[500px] mx-auto rounded-8 border border-dashed border-black dark:border-white py-12 flex gap-8 justify-center items-center'
      onClick={() => {
        openModal({ contents: <CreateBung /> })
      }}>
      <span className='text-black dark:text-white'>{children}</span>
      <PlusIcon />
    </button>
  )
}
