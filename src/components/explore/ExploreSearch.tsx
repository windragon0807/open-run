import { useSearchBungByLocation } from '@/apis/v1/bungs/location/query'
import { useSearchBungByNickname } from '@/apis/v1/bungs/nickname/query'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useAppStore } from '@store/app'
import Input from '@shared/Input'
import ArrowRightIcon from '@icons/ArrowRightIcon'
import useDebounce from '@hooks/useDebounce'
import { useSearchBungByHashtag } from '@apis/v1/bungs/hashtag/query'
import { formatDate } from '@utils/time'
import { colors } from '@styles/colors'

type Tab = '전체' | '멤버' | '해시태그' | '위치'

export default function ExploreSearch({ onCancelButtonClick }: { onCancelButtonClick: () => void }) {
  const { isApp } = useAppStore()
  const [keyword, setKeyword] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedTab, setSelectedTab] = useState<Tab>('전체')
  const tabList: Tab[] = ['전체', '멤버', '해시태그', '위치']

  // 페이지 첫 진입 시 입력란에 포커스
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <section className={clsx('h-full', isApp && 'pt-50')}>
      <div className='flex items-center gap-8 px-16 py-24'>
        <Input ref={inputRef} placeholder='벙 검색' value={keyword} setValue={setKeyword} />
        <button className='flex-shrink-0 px-8 text-14' onClick={onCancelButtonClick}>
          취소
        </button>
      </div>

      <div className='w-full border-b border-gray pl-24'>
        {tabList.map((tab) => (
          <button
            key={tab}
            className={clsx(
              'px-16 pb-8 text-14 font-bold',
              tab === selectedTab && 'border-b-2 border-primary text-primary',
            )}
            onClick={() => setSelectedTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div className='h-[calc(100%-122px)] overflow-y-auto px-16 pb-120 pt-32'>
        {/* <p className='text-base mt-80 text-center text-gray-darken'>검색 결과가 없어요</p> */}
        <Suspense fallback={<div>loading...</div>}>
          {selectedTab === '전체' && <SearchTotal keyword={keyword} setSelectedTab={setSelectedTab} />}
          {selectedTab === '멤버' && <SearchMember />}
          {selectedTab === '해시태그' && <SearchHashtag />}
          {selectedTab === '위치' && <SearchLocation />}
        </Suspense>
      </div>
    </section>
  )
}

function SearchTotal({ keyword, setSelectedTab }: { keyword: string; setSelectedTab: (tab: Tab) => void }) {
  const debouncedKeyword = useDebounce(keyword, 300)
  const { data: memberList } = useSearchBungByNickname(
    { nickname: debouncedKeyword },
    { enabled: debouncedKeyword !== '' },
  )
  const { data: hashtagList } = useSearchBungByHashtag(
    { hashtag: debouncedKeyword },
    { enabled: debouncedKeyword !== '' },
  )
  const { data: locationList } = useSearchBungByLocation(
    { location: debouncedKeyword },
    { enabled: debouncedKeyword !== '' },
  )
  const isSuccess = memberList != null && hashtagList != null && locationList != null
  if (!isSuccess) return <div>loading...</div>

  return (
    <section>
      {memberList.data.length > 0 && (
        <>
          <button className='mb-8 flex w-full items-center justify-between' onClick={() => setSelectedTab('멤버')}>
            <span className='text-16 font-bold'>
              <span className='text-primary'>{keyword}</span>님이 참여 중인 모임
            </span>
            <ArrowRightIcon size={24} color={colors.black.darken} />
          </button>
          <div className='mb-32 flex flex-col gap-8'>
            {memberList.data.slice(0, 4).map((item, index) => (
              <ExploreResult key={index} keyword={debouncedKeyword} {...item} />
            ))}
          </div>
        </>
      )}

      {hashtagList.data.length > 0 && (
        <>
          <button className='mb-8 flex w-full items-center justify-between'>
            <span className='text-16 font-bold'>
              <span className='text-primary'>{keyword}</span>님이 참여 중인 모임
            </span>
            <ArrowRightIcon size={24} color={colors.black.darken} />
          </button>
          <div className='mb-32 flex flex-col gap-8'>
            {hashtagList.data.slice(0, 4).map((item, index) => (
              <ExploreResult key={index} keyword={debouncedKeyword} {...item} />
            ))}
          </div>
        </>
      )}

      {locationList.data.length > 0 && (
        <>
          <button className='mb-8 flex w-full items-center justify-between'>
            <span className='text-16 font-bold'>
              <span className='text-primary'>{keyword}</span>님이 참여 중인 모임
            </span>
            <ArrowRightIcon size={24} color={colors.black.darken} />
          </button>
          <div className='flex flex-col gap-8'>
            {locationList.data.slice(0, 4).map((item, index) => (
              <ExploreResult key={index} keyword={debouncedKeyword} {...item} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

function SearchMember() {
  return <div>member</div>
}

function SearchHashtag() {
  return <div>hashtag</div>
}

function SearchLocation() {
  return <div>location</div>
}

function ExploreResult({
  bungId,
  name,
  mainImage,
  currentMemberCount,
  memberNumber,
  location,
  startDateTime,
  keyword,
}: {
  bungId: string
  name: string
  mainImage: string
  currentMemberCount: number
  memberNumber: number
  location: string
  startDateTime: string
  keyword: string
}) {
  return (
    <Link href={`/bung/${bungId}`} key={name} className='flex gap-16'>
      <div className='relative h-94 w-140 flex-shrink-0'>
        <Image src={mainImage} alt={name} fill className='rounded-8 object-cover' />
        <div className='absolute left-8 top-8 rounded-4 bg-black/60 px-4'>
          <span className='text-12 font-bold text-white'>{currentMemberCount}</span>
          <span className='text-12 text-gray-darken'>/{memberNumber}</span>
        </div>
      </div>
      <div className='flex flex-col pt-8'>
        <p className='mb-6 line-clamp-2 text-14 font-bold'>{renderHighlightKeyword(name, keyword)}</p>
        <span className='text-12'>{renderHighlightKeyword(location, keyword)}</span>
        <span className='text-12'>
          {formatDate({ date: startDateTime, formatStr: 'M월 d일 (E) a h:mm', convertUTCtoLocale: true })}
        </span>
      </div>
    </Link>
  )
}

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
