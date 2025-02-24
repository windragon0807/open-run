'use client'

import useLogout from '@hooks/useLogout'
import BellIcon from '@icons/BellIcon'
import MagnifierIcon from '@icons/MagnifierIcon'
import { colors } from '@styles/colors'
import { useUserStore } from '@store/user'
import Avatar from './Avatar'

export default function Header() {
  const { userInfo } = useUserStore()
  const { logout } = useLogout()

  return (
    <header className='fixed z-[100] flex h-84 w-full max-w-tablet items-center justify-between bg-gray-lighten p-[16px_12px_16px_16px]'>
      <span className='text-[28px] font-bold leading-[36px] tracking-[-0.56px]'>{userInfo?.nickname}</span>
      <div className='flex items-center gap-[15px]'>
        <BellIcon size={24} color={colors.black.darken} />
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
