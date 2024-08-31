'use client'

import { ReactNode } from 'react'

import { useModalContext } from '@contexts/ModalContext'
import PlusIcon from '@components/icons/PlusIcon'

export default function CreateBungButton({ children }: { children?: ReactNode }) {
  const { openModal } = useModalContext()
  return (
    <button
      className='w-full max-w-[500px] mx-auto rounded-8 border border-dashed border-black dark:border-white py-12 flex gap-8 justify-center items-center'
      onClick={() => {
        openModal({ contents: <div className='bg-white'>모달 컨텐츠</div> })
      }}>
      <span className='text-black dark:text-white'>{children}</span>
      <PlusIcon />
    </button>
  )
}
