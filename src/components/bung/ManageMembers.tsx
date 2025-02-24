import Image from 'next/image'
import { useModalContext } from '@contexts/ModalContext'
import Input from '@shared/Input'
import ArrowLeftIcon from '@icons/ArrowLeftIcon'
import MagnifierIcon from '@icons/MagnifierIcon'
import { BungMember } from '@type/bung'
import { colors } from '@styles/colors'
import useFushSearch from '@hooks/useFuseSearch'
import ConfirmDropoutModal from './modal/ConfirmDropoutModal'
import { PageCategory } from './types'

export default function ManageMembers({
  memberList,
  setPageCategory,
}: {
  memberList: BungMember[]
  setPageCategory: (category: PageCategory) => void
}) {
  const { openModal } = useModalContext()
  const { search, setSearch, filteredList } = useFushSearch(memberList, 'nickname')

  return (
    <section className='h-full w-full bg-gray-lighten'>
      <header className='relative flex h-60 w-full items-center justify-center'>
        <button className='absolute left-16' onClick={() => setPageCategory('벙 상세')}>
          <ArrowLeftIcon size={24} color={colors.black.darken} />
        </button>
        <span className='text-base font-bold text-black-default'>멤버 관리</span>
      </header>
      <section className='flex h-full w-full flex-col gap-16 px-16'>
        <Input
          className='pr-40'
          type='text'
          placeholder='닉네임을 검색하세요'
          value={search}
          setValue={setSearch}
          addon={
            <MagnifierIcon
              className='absolute bottom-1/2 right-16 translate-y-1/2'
              size={16}
              color={colors.black.darken}
            />
          }
        />

        <ul className='flex h-[calc(100%-230px)] flex-col gap-16 overflow-y-auto pb-40'>
          {filteredList.map((member) => (
            <li key={member.userId} className='flex items-center justify-between gap-8'>
              <div className='flex items-center gap-16'>
                <Image
                  className='rounded-8 bg-black-darken'
                  src='/temp/nft_detail_2.png'
                  alt={`${member.nickname}의 아바타`}
                  width={76}
                  height={76}
                />
                <div className='flex items-center gap-4'>
                  <span className='text-sm font-bold text-black-darken'>{member.nickname}</span>
                  {member.owner && <Image src='/images/icon_crown.png' alt='Crown Icon' width={16} height={18} />}
                </div>
              </div>
              {member.owner === false && (
                <button
                  className='rounded-12 bg-pink px-13 py-4 text-12 -tracking-[0.28px] text-white'
                  onClick={() => {
                    openModal({ contents: <ConfirmDropoutModal member={member} /> })
                  }}>
                  내보내기
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
