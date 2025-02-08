'use client'

import { useState } from 'react'
import { BottomSheet } from '@shared/Modal'
import BrokenXIcon from '@icons/BrokenXIcon'
import { useModalContext } from '@contexts/ModalContext'
import { colors } from '@styles/colors'
import Forms from './Forms'
import Invitation from './Invitation'

export default function CreateBung() {
  const { closeModal } = useModalContext()

  const [step, setStep] = useState<'create' | 'invitation'>('create')

  return (
    <BottomSheet fullSize>
      <header className='relative flex w-full h-60 justify-center items-center px-16'>
        <span className='text-[16px] leading-[24px] tracking-[-0.32px] font-bold'>
          {step === 'create' ? '벙 만들기' : '멤버 초대'}
        </span>
        <button className='absolute right-16' onClick={closeModal}>
          {step === 'create' ? (
            <BrokenXIcon size={24} color={colors.black.default} />
          ) : (
            <span className='text-14 tracking-[-0.28px] text-black-darken'>건너뛰기</span>
          )}
        </button>
      </header>

      <section className='h-[calc(100%-110px)] overflow-y-auto'>
        {step === 'create' ? <Forms nextStep={() => setStep('invitation')} /> : <Invitation />}
      </section>
    </BottomSheet>
  )
}
