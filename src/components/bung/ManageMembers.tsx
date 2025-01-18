import Image from 'next/image'
import { useModalContext } from '@contexts/ModalContext'
import Input from '@shared/Input'
import BackIcon from '@icons/BackIcon'
import MagnifierIcon from '@icons/MagnifierIcon'
import { BungDetailMember } from '@/types/bung'
import { colors } from '@styles/colors'
import useFushSearch from '@hooks/useFuseSearch'
import ConfirmDropoutModal from './modal/ConfirmDropoutModal'
import { PageCategory } from './types'

export default function ManageMembers({
  memberList,
  setPageCategory,
}: {
  memberList: BungDetailMember[]
  setPageCategory: (category: PageCategory) => void
}) {
  const { openModal } = useModalContext()
  const { search, setSearch, filteredList } = useFushSearch(memberList, 'nickname')

  return (
    <section className='w-full h-full bg-gray-lighten'>
      <header className='relative w-full h-60 flex justify-center items-center'>
        <button className='absolute left-16' onClick={() => setPageCategory('벙 상세')}>
          <BackIcon size={24} color={colors.blackDarken} />
        </button>
        <span className='text-base font-bold text-black'>멤버 관리</span>
      </header>
      <section className='flex flex-col gap-16 w-full h-full px-16'>
        <Input
          className='pr-40'
          type='text'
          placeholder='닉네임을 검색하세요'
          value={search}
          setValue={setSearch}
          addon={<MagnifierIcon className='absolute right-16 bottom-1/2 translate-y-1/2' />}
        />

        <ul className='flex flex-col gap-16 h-[calc(100%-230px)] overflow-y-auto pb-40'>
          {filteredList.map((member) => (
            <li key={member.userId} className='flex justify-between items-center gap-8'>
              <div className='flex items-center gap-16'>
                <Image
                  className='bg-black-darken rounded-8'
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
                  className='bg-pink rounded-12 px-13 py-4 text-12 text-white -tracking-[0.28px]'
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
