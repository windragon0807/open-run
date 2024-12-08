import { useState } from 'react'
import Image from 'next/image'

import { useModalContext } from '@contexts/ModalContext'
import Input from '@shared/Input'
import BackIcon from '@icons/BackIcon'
import MagnifierIcon from '@icons/MagnifierIcon'
import { BungDetailMember } from '@/types/bung'

export default function DelegateOwnerModal({ memberList }: { memberList: BungDetailMember[] }) {
  const { closeModal } = useModalContext()

  const [search, setSearch] = useState('')
  return (
    <section className='w-full h-full bg-gray-lighten' onClick={(e) => e.stopPropagation()}>
      <header className='relative w-full h-60 flex justify-center items-center'>
        <button className='absolute left-16' onClick={closeModal}>
          <BackIcon size={24} color='#222' />
        </button>
        <span className='text-base font-bold text-black'>벙주 넘기기</span>
      </header>
      <section className='flex flex-col gap-16 w-full h-full px-16'>
        <div className='w-full rounded-8 bg-white p-16'>
          <h5 className='text-sm font-bold text-black-darken text-center mb-4'>
            개설한 벙을 다른 멤버에게 양도할 수 있어요
          </h5>
          <ul className='space-y-2 px-16'>
            <li className='list-disc text-black-darken text-sm'>양도 요청은 벙 시작 1시간 전까지 가능합니다.</li>
            <li className='list-disc text-black-darken text-sm'>
              지정한 멤버가 30분 이내에 요청을 수락하면 완료됩니다.
            </li>
          </ul>
        </div>

        <Input
          className='pr-40'
          type='text'
          placeholder='닉네임을 검색하세요'
          value={search}
          setValue={setSearch}
          addon={<MagnifierIcon className='absolute right-16 bottom-1/2 translate-y-1/2' />}
        />

        <ul className='flex flex-col gap-16 h-[calc(100%-230px)] overflow-y-auto pb-40'>
          {memberList.map((member) => (
            <li key={member.userId} className='flex justify-between items-center gap-8'>
              <div className='flex items-center gap-16'>
                <Image
                  className='bg-black-darken rounded-8'
                  src='/temp/nft_detail_1.png'
                  alt={`${member.nickname}의 아바타`}
                  width={76}
                  height={76}
                />
                <span className='text-sm font-bold text-black-darken'>{member.nickname}</span>
              </div>
              <button className='bg-black-darken rounded-12 px-9 py-4 text-12 text-white -tracking-[0.28px]'>
                벙주 넘기기
              </button>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
