'use client'

import useLogout from '@hooks/useLogout'
import BellIcon from '@icons/BellIcon'
import Avatar from './Avatar'

export default function Header({ nickname }: { nickname: string }) {
  const { logout } = useLogout()
  return (
    <header className='fixed z-[100] bg-gray-lighten dark:bg-black-darken w-full max-w-tablet h-84 flex justify-between p-[16px_12px_16px_16px]'>
      <div className='flex flex-col'>
        {/* <span className='text-[12px] leading-[16px] tracking-[-0.24px]'>칭호가 들어갑니다</span> */}
        <span className='text-[28px] leading-[36px] tracking-[-0.56px] font-bold dark:text-white'>{nickname}</span>
      </div>
      <div className='flex items-center gap-[13px]'>
        <BellIcon />
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
