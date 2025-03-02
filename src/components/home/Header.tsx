'use client'

import { useUserStore } from '@store/user'
import BellIcon from '@icons/BellIcon'
import MagnifierIcon from '@icons/MagnifierIcon'
import useLogout from '@hooks/useLogout'
import { colors } from '@styles/colors'
import Avatar from './Avatar'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { userInfo } = useUserStore()
  const { logout } = useLogout()
  const router = useRouter()

  /**
   * 도전과제 모달을 여는 함수
   */
  const handleOpenAchievements = () => {
    router.push('/achievements')
  }

  return (
    <header className='fixed z-[100] flex h-84 w-full max-w-tablet items-center justify-between bg-gray-lighten p-[16px_12px_16px_16px]'>
      <span className='text-28 font-bold'>{userInfo?.nickname}</span>
      <div className='flex items-center gap-[15px]'>
        <button onClick={handleOpenAchievements}>
          <BellIcon size={24} color={colors.black.darken} />
        </button>
        <MagnifierIcon size={24} color={colors.black.darken} />
        <button
          onClick={() => {
            if (window.confirm('정말로 로그아웃하시겠습니까?')) {
              logout()
            }
          }}>
          <Avatar imageSrc='/temp/nft_character_sm.png' size={40} />
        </button>
      </div>
    </header>
  )
}
