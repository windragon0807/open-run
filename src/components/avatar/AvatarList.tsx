'use client'

import Image from 'next/image'
import { useQuery } from 'react-query'

import Spacing from '@shared/Spacing'
import { useModalContext } from '@contexts/ModalContext'
import { fetchNftList } from '@apis/nfts/fetchNftList/api'
import DetailModal from './DetailModal'

export default function AvatarList() {
  const { openModal } = useModalContext()

  const { data: avatarList } = useQuery({
    queryKey: ['avatarList'],
    queryFn: fetchNftList,
  })

  return (
    <section className='w-full h-full overflow-y-auto px-16'>
      <div className='grid grid-cols-3 gap-8'>
        {avatarList?.data.map((avatar) => (
          <button
            key={avatar.id}
            className='relative w-full p-12 flex flex-col items-center gap-10 bg-[rgba(255,255,255,0.20)] rounded-4 hover:bg-white hover:shadow-shadow_white'
            onClick={() => {}}>
            <div className='relative w-full max-w-80 aspect-square'>
              <Image src={avatar.imageUrl} alt='' fill className='object-contain' />
              {/* Skewed New Label */}
              <div className='absolute left-[50%] -translate-x-[50%] bottom-0 h-20 bg-secondary rounded-lg transform -skew-x-[10deg] border-2 border-black flex items-center justify-center gap-4 px-8'>
                <span className='text-12 font-[900]'>NEW</span>
              </div>
            </div>
            <span className='text-12 text-black-darken'>{avatar.name}</span>

            {/* Info Modal */}
            <button
              className='absolute top-6 right-6'
              onClick={() => {
                openModal({
                  contents: (
                    <DetailModal
                      serialNumber={avatar.id}
                      imageSrc={avatar.imageUrl}
                      rarity={avatar.rarity}
                      category={avatar.mainCategory}
                      name={avatar.name}
                    />
                  ),
                })
              }}>
              <InfoIcon />
            </button>
          </button>
        ))}
      </div>

      <Spacing size={30} />
    </section>
  )
}

function InfoIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <circle cx='12.0002' cy='12' r='9.5' fill='#F8F9FA' stroke='#DEE2E6' />
      <path
        d='M11.1859 8.05667C11.1859 7.66556 11.3205 7.35 11.5898 7.11C11.8678 6.87 12.2022 6.75 12.5931 6.75C12.9839 6.75 13.314 6.87 13.5833 7.11C13.8612 7.35 14.0002 7.66556 14.0002 8.05667C14.0002 8.44778 13.8612 8.76333 13.5833 9.00333C13.314 9.24333 12.9839 9.36333 12.5931 9.36333C12.2022 9.36333 11.8678 9.24333 11.5898 9.00333C11.3205 8.76333 11.1859 8.44778 11.1859 8.05667ZM11.0295 11.1167H13.4399L12.4106 17.25H10.0002L11.0295 11.1167Z'
        fill='#89939D'
      />
    </svg>
  )
}