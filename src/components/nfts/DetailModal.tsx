'use client'

import Image from 'next/image'

import Spacing from '@shared/Spacing'
import { useModalContext } from '@contexts/ModalContext'
import XIcon from '@components/icons/XIcon'
import TripleGraterIcons from '@components/icons/TripleGraterIcons'

export default function DetailModal() {
  const { closeModal } = useModalContext()

  return (
    <section className='relative w-full h-full flex justify-center items-center'>
      <div
        className='w-[70%] rounded-8 border-2 border-[rgba(255,255,255,0.20)] bg-black-darken pt-40 pb-24 flex flex-col items-center'
        onClick={(e) => e.stopPropagation()}>
        <div className='relative w-168 aspect-[1]'>
          <span className='absolute bottom-5 text-black text-[40px] font-black w-full text-center'>000001</span>
          <Image src='/temp/nft_minting.png' alt='' fill />
        </div>
        <Spacing size={8} />
        <div className='px-8 rounded-4 bg-[rgba(255,255,255,0.20)]'>
          <span className='text-[12px] font-bold leading-[16px] text-white'>COMMON</span>
        </div>
        <Spacing size={8} />
        <span className='text-[16px] leading-[24px] tracking-[-0.32px] font-bold text-white'>
          아이템 이름이 들어갑니다
        </span>
        <Spacing size={4} />
        <span className='text-[12px] leading-[16px] tracking-[-0.24px] text-white'>아이템 분류</span>
        <Spacing size={24} />
        <button className='h-24 rounded-12 px-13 py-4 flex gap-4 items-center bg-[rgba(255,255,255,0.20)]'>
          <span className='text-[12px] leading-[16px] text-white'>스캐너 페이지로 이동</span>
          <TripleGraterIcons />
        </button>
      </div>
      <button
        className='absolute bottom-60 bg-[#fff] bg-opacity-20 w-56 aspect-[1] rounded-8 flex justify-center items-center'
        onClick={() => closeModal()}>
        <XIcon />
      </button>
    </section>
  )
}
