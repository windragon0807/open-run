'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'

import Input from '@shared/Input'
import Spacing from '@shared/Spacing'
import MagnifierIcon from '@icons/MagnifierIcon'
import CheckIcon from '@icons/CheckIcon'
import useDebounce from '@hooks/useDebounce'
import { searchByNickname as _searchByNickname } from '@apis/users/searchByNickname/api'
import { fetchSuggestion } from '@apis/users/fetchSuggestion/api'
import PrimaryButton from '@shared/PrimaryButton'
import CloseIcon from '@icons/CloseIcon'

export default function Invitation() {
  const [selectedMembers, setSelectedMembers] = useState<
    {
      userId: string
      nickname: string
    }[]
  >([])

  /* 멤버 추천 관련 */
  const { data: suggestionList } = useQuery({
    queryKey: ['/users/suggestion'],
    queryFn: () => fetchSuggestion({ page: 0, limit: 10 }),
  })

  const renderSuggestionList = () => {
    if (suggestionList == null) return null
    if (suggestionList.data.length === 0)
      return <div className='mt-20 text-14 text-gray-default text-center'>아직 함께했던 멤버가 없습니다.</div>
    return suggestionList.data.map(({ userId, nickname }) => (
      <Member
        key={userId}
        imageUrl='/temp/nft_invitation.png' // TODO
        isRecommend
        name={nickname}
        isSelected={selectedMembers.some((member) => member.userId === userId)}
        onInvite={(isInvited) => {
          setSelectedMembers((prev) =>
            isInvited ? [...prev, { userId, nickname }] : prev.filter((member) => member.userId !== userId),
          )
        }}
      />
    ))
  }
  /* -------- */

  /* 멤버 검색 관련 */
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const { mutate: searchByNickname, data: searchedList } = useMutation(_searchByNickname)
  useEffect(() => {
    if (debouncedSearch) {
      searchByNickname({ nickname: debouncedSearch })
    }
  }, [debouncedSearch]) // eslint-disable-line react-hooks/exhaustive-deps

  const renderSearchedList = () => {
    if (searchedList == null) return null
    if (searchedList.data.length === 0)
      return <div className='mt-20 text-14 text-gray-default text-center'>검색 결과가 없습니다.</div>
    return searchedList.data.map(({ userId, nickname }) => (
      <Member
        key={userId}
        imageUrl='/temp/nft_invitation.png' // TODO
        isRecommend={false}
        name={nickname}
        isSelected={selectedMembers.some((member) => member.userId === userId)}
        onInvite={(isInvited) => {
          setSelectedMembers((prev) =>
            isInvited ? [...prev, { userId, nickname }] : prev.filter((member) => member.userId !== userId),
          )
        }}
      />
    ))
  }
  /* -------- */

  const 멤버추천리스트를보여줄상태인가 = debouncedSearch === ''

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
      <Spacing size={16} />
      <div className='w-full'>
        <ul className='h-28 flex items-center gap-8 overflow-x-auto'>
          {selectedMembers.map((member) => (
            <li key={member.userId} className='shrink-0'>
              <SelectedMember
                nickname={member.nickname}
                onClose={() => {
                  setSelectedMembers((prev) => prev.filter(({ userId }) => userId !== member.userId))
                }}
              />
            </li>
          ))}
        </ul>
      </div>
      <Spacing size={32} />
      <ul className='flex flex-col gap-8 h-[calc(100%-160px)] overflow-y-auto pr-8 pb-20'>
        {멤버추천리스트를보여줄상태인가 ? renderSuggestionList() : renderSearchedList()}
      </ul>
      <div className='absolute bottom-20 w-[calc(100%-32px)]'>
        <PrimaryButton disabled={selectedMembers.length === 0}>초대 완료</PrimaryButton>
      </div>
    </section>
  )
}

function Member({
  imageUrl,
  isRecommend,
  name,
  isSelected,
  onInvite,
}: {
  imageUrl: string
  isRecommend: boolean
  name: string
  isSelected: boolean
  onInvite?: (isInvited: boolean) => void
}) {
  return (
    <li>
      <div className='flex justify-between items-center'>
        <div className='flex gap-16 items-center'>
          <Image src={imageUrl} alt='' width={76} height={76} />
          <div className='flex flex-col gap-4'>
            {isRecommend && (
              <span className='bg-gray-default py-2 px-4 rounded-4 text-12 text-black-darken w-fit'>추천</span>
            )}
            <span className='text-14 font-bold text-black-darken'>{name}</span>
          </div>
        </div>
        {isSelected === false ? (
          <button
            className='w-67 h-24 bg-black-darken flex justify-center items-center rounded-12 text-white text-12'
            onClick={() => {
              onInvite?.(true)
            }}>
            초대하기
          </button>
        ) : (
          <button
            className='w-67 h-24 bg-primary flex justify-center items-center gap-2 rounded-12 text-white text-12'
            onClick={() => {
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

function SelectedMember({ nickname, onClose }: { nickname: string; onClose: () => void }) {
  return (
    <div className='shrink-0 flex items-center gap-8 px-8 py-4 rounded-4 bg-gray-default w-fit'>
      <span className='text-sm font-bold'>{nickname}</span>
      <button onClick={onClose}>
        <CloseIcon size={16} />
      </button>
    </div>
  )
}
