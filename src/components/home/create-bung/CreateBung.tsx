'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

import Spacing from '@shared/Spacing'
import { useModalContext } from '@contexts/ModalContext'
import CloseIcon from '@/components/icons/CloseIcon'
import Forms from './Forms'

export default function CreateBung() {
  const { closeModal } = useModalContext()
  return (
    <motion.div
      initial={{ y: '50%' }}
      animate={{ y: '7%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className='fixed bottom-0 left-0 w-full h-full bg-gray-lighten dark:bg-black-darken shadow-lg rounded-t-2xl'
      onClick={(e) => e.stopPropagation()}>
      <header className='relative flex w-full h-60 justify-center items-center px-16'>
        <span className='text-[16px] leading-[24px] tracking-[-0.32px] font-bold dark:text-white'>벙 만들기</span>
        <button className='absolute right-16' onClick={closeModal}>
          <CloseIcon />
        </button>
      </header>
      <section className='h-[calc(100%-110px)] overflow-y-auto px-16'>
        <section className='relative w-full h-184 rounded-8'>
          <Image className='w-full h-full rounded-8' src='/temp/img_thumbnail_1.png' alt='Thumbnail Image' fill />
        </section>
        <Spacing size={32} />
        <Forms />
        <Spacing size={40} />
      </section>
    </motion.div>
  )
}
