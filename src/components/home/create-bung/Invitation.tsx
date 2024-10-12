'use client'

import { useState } from 'react'
import Image from 'next/image'

import Input from '@shared/Input'
import Spacing from '@shared/Spacing'
import MagnifierIcon from '@icons/MagnifierIcon'
import CheckIcon from '@icons/CheckIcon'

export default function Invitation() {
  const [search, setSearch] = useState('')

  return (
    <section className='relative w-full h-full flex flex-col overflow-y-auto px-16'>
      <Spacing size={16} />
      <Input
        className='pr-40'
        type='text'
        placeholder='닉네임을 검색하세요'
        value={search}
        setValue={setSearch}
        addon={<MagnifierIcon className='absolute right-16 bottom-1/2 translate-y-1/2' />}
      />
      <Spacing size={24} />
      <ul className='flex flex-col gap-8 h-[calc(100%-160px)] overflow-y-auto pr-8 pb-20'>
        <Member imageUrl='/temp/nft_invitation.png' isRecommend name='UserName' />
        <Member imageUrl='/temp/nft_invitation.png' isRecommend name='UserName' />
        <Member imageUrl='/temp/nft_invitation.png' isRecommend name='UserName' />
        <Member imageUrl='/temp/nft_invitation.png' isRecommend name='UserName' />
        <Member imageUrl='/temp/nft_invitation.png' isRecommend name='UserName' />
        <Member imageUrl='/temp/nft_invitation.png' isRecommend name='UserName' />
        <Member imageUrl='/temp/nft_invitation.png' isRecommend name='UserName' />
      </ul>
      <button className='absolute bottom-20 bg-primary w-[calc(100%-32px)] h-58 rounded-8 text-white text-base'>
        초대 완료
      </button>
    </section>
  )
}

function Member({
  imageUrl,
  isRecommend,
  name,
  onInvite,
}: {
  imageUrl: string
  isRecommend: boolean
  name: string
  onInvite?: (isInvited: boolean) => void
}) {
  const [isInvited, setIsInvited] = useState(false)
  return (
    <li>
      <div className='flex justify-between items-center'>
        <div className='flex gap-16 items-center'>
          <Image src={imageUrl} alt='' width={76} height={76} />
          <div className='flex flex-col gap-4'>
            {isRecommend && <span className='bg-gray py-2 px-4 rounded-4 text-12 text-black-darken w-fit'>추천</span>}
            <span className='text-14 font-bold text-black-darken'>{name}</span>
          </div>
        </div>
        {isInvited === false ? (
          <button
            className='w-67 h-24 bg-black-darken flex justify-center items-center rounded-12 text-white text-12'
            onClick={() => {
              setIsInvited(true)
              onInvite?.(true)
            }}>
            초대하기
          </button>
        ) : (
          <button
            className='w-67 h-24 bg-primary flex justify-center items-center gap-2 rounded-12 text-white text-12'
            onClick={() => {
              setIsInvited(false)
              onInvite?.(false)
            }}>
            선택
            <CheckIcon />
          </button>
        )}
      </div>
    </li>
  )
}
