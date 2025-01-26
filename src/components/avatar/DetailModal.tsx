'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useModalContext } from '@contexts/ModalContext'
import CloseIcon from '@icons/CloseIcon'
import PrimaryButton from '@shared/PrimaryButton'
import RarityBadge from './shared/RarityBadge'
import { Rarity } from '@/types/avatar'

export default function DetailModal({
  serialNumber,
  imageSrc,
  rarity,
  category,
  name,
}: {
  serialNumber: string
  imageSrc: string
  rarity: Rarity
  category: string
  name: string
}) {
  const { closeModal } = useModalContext()

  return (
    <section className='w-full h-full px-16 flex justify-center items-center'>
      <div
        className='relative w-full max-w-[328px] h-480 rounded-8 flex flex-col items-center bg-white bg-gradient-white-secondary-primary'
        onClick={(e) => e.stopPropagation()}>
        <header className='relative w-full h-60 flex items-center justify-center mb-16'>
          <span className='text-base font-bold'>NFT 아이템</span>
          <button className='absolute right-18' onClick={closeModal}>
            <CloseIcon />
          </button>
        </header>

        <div className='relative w-168 aspect-square mb-8'>
          <span className='absolute left-1/2 -translate-x-1/2 bottom-0 font-jost text-[56px] font-[900] italic text-black-default opacity-10'>
            {serialNumber}
          </span>
          <Image src={imageSrc} alt='Avatar' fill className='object-contain' />
        </div>

        <RarityBadge rarity={rarity} />
        <h4 className='text-base font-bold text-black-darken mb-4'>{name}</h4>
        <span className='text-12 text-gray-darkest'>{category}</span>

        <Link href='' className='absolute bottom-40 w-[calc(100%-32px)]'>
          <PrimaryButton>스캐너 페이지로 이동</PrimaryButton>
        </Link>
      </div>
    </section>
  )
}
