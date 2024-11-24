'use client'

import { Fragment } from 'react'

import ArrowRight from '@icons/ArrowRight'
import { useModalContext } from '@contexts/ModalContext'
import CloseIcon from '@icons/CloseIcon'

export default function Certification() {
  const { openModal } = useModalContext()

  return (
    <Fragment>
      <div className='w-full h-56 rounded-8 border border-black-darken pl-16 pr-8 flex items-center justify-between mb-8'>
        <p className='text-start text-12 text-black-darken font-bold'>
          러닝 시작 전, 벙주의 안내에 따라 <br />
          참여 인증을 해주세요
        </p>
        <button className='bg-black-darken px-14 py-10 rounded-8 text-sm text-white font-bold disabled:bg-gray disabled:text-white'>
          참여 인증
        </button>
      </div>
      <button
        className='w-full h-32 rounded-8 px-16 bg-gray-lighten flex items-center justify-between'
        onClick={() => {
          openModal({
            contents: <WhyCertificationModal />,
          })
        }}>
        <p className='text-12 text-black-darken font-bold'>참여 인증을 왜 해야 하나요?</p>
        <ArrowRight size={16} color='var(--black-darken)' />
      </button>
    </Fragment>
  )
}

function WhyCertificationModal() {
  const { closeModal } = useModalContext()
  return (
    <section
      className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[328px] h-[70%] bg-white rounded-8'
      onClick={(e) => e.stopPropagation()}>
      <div className='w-full h-full'>
        <header className='relative w-full h-60 flex items-center justify-center'>
          <h3 className='text-16 font-bold text-black-darken'>참여 인증을 왜 해야 하나요?</h3>
          <button className='absolute right-16' onClick={closeModal}>
            <CloseIcon size={24} />
          </button>
        </header>
      </div>
    </section>
  )
}
