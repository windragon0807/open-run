'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@store/app'
import Recommendation from '@components/home/Recommendation'
import Input from '@shared/Input'
import MagnifierIcon from '@icons/MagnifierIcon'
import { formatDate } from '@utils/time'
import { colors } from '@styles/colors'

export default function Explore() {
  const [isSearchMode, setIsSearchMode] = useState(false)
  return !isSearchMode ? (
    <ExploreHome onSearchButtonClick={() => setIsSearchMode(true)} />
  ) : (
    <ExploreSearch onCancelButtonClick={() => setIsSearchMode(false)} />
  )
}

function ExploreHome({ onSearchButtonClick }: { onSearchButtonClick: () => void }) {
  const { isApp } = useAppStore()
  return (
    <section className='h-full w-full bg-white'>
      <div className={clsx('px-16', isApp ? 'pt-72' : 'pt-32')}>
        <h1 className='mb-16 text-28 font-bold'>탐색</h1>
        <button
          className='mb-24 flex h-40 w-full items-center justify-between rounded-8 border border-gray px-16'
          onClick={onSearchButtonClick}>
          <span className='text-14 text-gray-darken'>벙 검색</span>
          <MagnifierIcon size={16} color={colors.black.darken} />
        </button>
      </div>
      <Recommendation />
    </section>
  )
}

function ExploreSearch({ onCancelButtonClick }: { onCancelButtonClick: () => void }) {
  const { isApp } = useAppStore()
  const [keyword, setKeyword] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // 페이지 첫 진입 시 입력란에 포커스
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const 검색한멤버가참여한벙리스트 = [
    {
      id: 1,
      title:
        'Title Title 서울 Title Title Title Title Title Title Title Title Title Title Title Title Title Title Title Title Title',
      location: '서울 마포구 공덕동',
      startDate: '2025-06-11 19:00:00',
      memberCount: 299,
      totalMemberCount: 300,
      imageUrl: '/images/bung/img_thumbnail_1.png',
    },
    {
      id: 2,
      title: 'Title',
      location: '서울 마포구 공덕동',
      startDate: '2025-06-11 19:00:00',
      memberCount: 3,
      totalMemberCount: 12,
      imageUrl: '/images/bung/img_thumbnail_4.png',
    },
  ]
  const 전체벙리스트 = [
    {
      id: 3,
      title:
        'Title Title 서울 Title Title Title Title Title Title Title Title Title Title Title Title Title Title Title Title Title',
      location: '서울 마포구 공덕동',
      startDate: '2025-06-11 19:00:00',
      memberCount: 33,
      totalMemberCount: 120,
      imageUrl: '/images/bung/img_thumbnail_1.png',
    },
    {
      id: 4,
      title:
        'Title Title 서울 Title Title Title Title Title Title Title Title Title Title Title Title Title Title Title Title Title',
      location: '서울 마포구 공덕동',
      startDate: '2025-06-11 19:00:00',
      memberCount: 2,
      totalMemberCount: 3,
      imageUrl: '/images/bung/img_thumbnail_5.png',
    },
    {
      id: 5,
      title: 'TitleTitleTitle',
      location: '서울 마포구 공덕동',
      startDate: '2025-06-11 19:00:00',
      memberCount: 1,
      totalMemberCount: 2,
      imageUrl: '/images/bung/img_thumbnail_7.png',
    },
    {
      id: 6,
      title:
        'Title Title 서울 Title Title Title Title Title Title Title Title Title Title Title Title Title Title Title Title Title',
      location: '서울 마포구 공덕동',
      startDate: '2025-06-11 19:00:00',
      memberCount: 1,
      totalMemberCount: 10,
      imageUrl: '/images/bung/img_thumbnail_4.png',
    },
  ]

  return (
    <section className={clsx('h-full', isApp && 'pt-50')}>
      <div className='flex items-center gap-8 px-16 py-24'>
        <Input ref={inputRef} placeholder='벙 검색' value={keyword} setValue={setKeyword} />
        <button className='flex-shrink-0 px-8 text-14' onClick={onCancelButtonClick}>
          취소
        </button>
      </div>
      <div className='h-[calc(100%-88px)] overflow-y-auto px-16 pb-120'>
        {/* <p className='text-base mt-80 text-center text-gray-darken'>검색 결과가 없어요</p> */}
        <div className='mb-56 flex flex-col pt-16'>
          <h3 className='text-base mb-8 font-bold'>{keyword} 멤버가 참여한 벙</h3>
          <ul className='flex flex-col gap-8'>
            {검색한멤버가참여한벙리스트.map((item) => (
              <ExploreResult key={item.id} {...item} keyword={keyword} />
            ))}
          </ul>
        </div>
        <div className='flex flex-col pt-16'>
          <h3 className='text-base mb-8 font-bold'>전체</h3>
          <ul className='flex flex-col gap-8'>
            {전체벙리스트.map((item) => (
              <ExploreResult key={item.id} {...item} keyword={keyword} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function ExploreResult({
  title,
  imageUrl,
  memberCount,
  totalMemberCount,
  location,
  startDate,
  keyword,
}: {
  title: string
  imageUrl: string
  memberCount: number
  totalMemberCount: number
  location: string
  startDate: string
  keyword: string
}) {
  const renderHighlightKeyword = (text: string, keyword: string) => {
    if (keyword === '') return text

    const parts = text.split(keyword)
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && <span className='text-primary'>{keyword}</span>}
      </span>
    ))
  }

  return (
    <li key={title} className='flex gap-16'>
      <div className='relative h-94 w-140 flex-shrink-0'>
        <Image src={imageUrl} alt={title} fill className='rounded-8 object-cover' />
        <div className='absolute left-8 top-8 rounded-4 bg-black/60 px-4'>
          <span className='text-12 font-bold text-white'>{memberCount}</span>
          <span className='text-12 text-gray-darken'>/{totalMemberCount}</span>
        </div>
      </div>
      <div className='flex flex-col pt-8'>
        <p className='mb-6 line-clamp-2 text-14 font-bold'>{renderHighlightKeyword(title, keyword)}</p>
        <span className='text-12'>{renderHighlightKeyword(location, keyword)}</span>
        <span className='text-12'>
          {formatDate({ date: startDate, formatStr: 'M월 d일 (E) a h:mm', convertUTCtoLocale: true })}
        </span>
      </div>
    </li>
  )
}
