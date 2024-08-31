'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

import Spacing from '@shared/Spacing'
import { useModalContext } from '@contexts/ModalContext'

export default function MintingModal({
  serialNumber,
  imageSrc,
  rarity,
  category,
}: {
  serialNumber: string
  imageSrc: string
  rarity: string
  category: string
}) {
  const router = useRouter()
  const { closeModal } = useModalContext()

  return (
    <section className='relative w-full h-full flex justify-center items-center'>
      <div className='relative w-[70%] p-1 rounded-lg'>
        <div className='absolute inset-0 rounded-lg bg-gradient-to-b from-[#E0FB60] to-[#4A5CEF] p-[2px]'></div>
        <div className='relative rounded-lg bg-black p-4 flex flex-col items-center'>
          <Spacing size={16} />
          <Image src='/images/img_new.png' alt='' width={39} height={24} />
          <div className='relative w-168 aspect-[1]'>
            <span className='absolute bottom-5 text-black-darken text-[40px] font-black w-full text-center'>
              {serialNumber}
            </span>
            <Image src={imageSrc || ''} alt='' fill />
          </div>
          <Spacing size={8} />
          <div className='px-8 rounded-4 bg-[rgba(255,255,255,0.20)]'>
            <span className='text-[12px] font-bold leading-[16px] text-white'>{rarity.toUpperCase()}</span>
          </div>
          <Spacing size={8} />
          <span className='text-[16px] leading-[24px] tracking-[-0.32px] font-bold text-white'>
            아이템을 획득하였습니다.
          </span>
          <Spacing size={4} />
          <span className='text-[12px] leading-[16px] tracking-[-0.24px] text-white'>{category}</span>
          <Spacing size={72} />
        </div>
      </div>

      <button
        className='absolute bottom-60 bg-primary w-[80%] h-56 aspect-[1] rounded-8 flex justify-center items-center'
        onClick={() => {
          closeModal()
          router.push('/avatar')
        }}>
        <span className='text-[16px] font-bold text-white'>아바타에 적용하기</span>
      </button>
    </section>
  )
}
