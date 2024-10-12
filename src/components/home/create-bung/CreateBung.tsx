'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

import CloseIcon from '@icons/CloseIcon'
import { useModalContext } from '@contexts/ModalContext'
import Forms from './Forms'
import Invitation from './Invitation'

export default function CreateBung() {
  const { closeModal } = useModalContext()

  const [step, setStep] = useState<'create' | 'invitation'>('invitation')

  return (
    <motion.div
      initial={{ y: '50%' }}
      animate={{ y: '7%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className='fixed bottom-0 left-0 w-full h-full bg-gray-lighten dark:bg-black-darken shadow-lg rounded-t-2xl'
      onClick={(e) => e.stopPropagation()}>
      <header className='relative flex w-full h-60 justify-center items-center px-16'>
        <span className='text-[16px] leading-[24px] tracking-[-0.32px] font-bold dark:text-white'>
          {step === 'create' ? '벙 만들기' : '멤버 초대'}
        </span>
        <button className='absolute right-16' onClick={closeModal}>
          {step === 'create' ? (
            <CloseIcon />
          ) : (
            <span className='text-14 tracking-[-0.28px] text-black-darken'>건너뛰기</span>
          )}
        </button>
      </header>

      <section className='h-[calc(100%-110px)] overflow-y-auto'>
        {step === 'create' ? <Forms nextStep={() => setStep('invitation')} /> : <Invitation />}
      </section>
    </motion.div>
  )
}
