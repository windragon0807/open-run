'use client'

import Image from 'next/image'
import { useQuery } from 'react-query'

import Spacing from '@shared/Spacing'
import { useModalContext } from '@contexts/ModalContext'
import { fetchNftList } from '@apis/nfts/fetchNftList/api'
import DetailModal from '../nfts/DetailModal'

export default function AvatarList() {
  const { openModal } = useModalContext()

  const { data: avatarList } = useQuery({
    queryKey: ['avatarList'],
    queryFn: fetchNftList,
  })

  return (
    <section className='w-full h-full overflow-y-auto px-16'>
      <div className='grid grid-cols-3 gap-x-[18px] gap-y-[20px]'>
        {avatarList?.data.map((avatar) => (
          <button
            key={avatar.id}
            className='relative aspect-square flex items-center justify-center bg-[rgba(255,255,255,0.20)] rounded-4 border-4 border-primary'
            onClick={() => {
              openModal({
                contents: (
                  <DetailModal
                    serialNumber='341285'
                    imageSrc='https://xrpl-s3-bucket.s3.ap-northeast-2.amazonaws.com/green_shoe.png'
                    rarity='common'
                    category='Shoes'
                    name='신발 1'
                    id='0000000045EC17AA98C48D9309D9519FFB347FCDBE2799E3F88173C600053525'
                  />
                ),
              })
            }}>
            <Image
              className='absolute left-8 top-12'
              src='https://xrpl-s3-bucket.s3.ap-northeast-2.amazonaws.com/green_shoe.png'
              alt=''
              fill
            />
          </button>
        ))}
      </div>

      <Spacing size={30} />
    </section>
  )
}
