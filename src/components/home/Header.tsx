'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@store/user'
import BellIcon from '@icons/BellIcon'
import useLogout from '@hooks/useLogout'
import addDelimiter from '@utils/addDelimiter'
import { colors } from '@styles/colors'

export default function Header() {
  const router = useRouter()
  const { userInfo } = useUserStore()
  const { logout } = useLogout()

  return (
    <header className='flex h-[200px] justify-between bg-gradient-header-sample'>
      <div className='relative flex w-[176px] flex-shrink-0 items-end justify-end'>
        <Image className='absolute object-cover' src='/images/home/bg_cloud.png' alt='cloud' fill />
        <Image
          className='absolute border'
          src='/temp/nft_character_lg.png'
          alt='NFT Character'
          width={160}
          height={200}
          priority
        />
        <div className='absolute bottom-8 left-12'>
          <SkewedLikeLabel like={300} />
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='m-[16px_24px_16px] flex items-center justify-end gap-8'>
          <span className='text-20 font-bold text-white'>{userInfo?.nickname}</span>
          <button className='-translate-y-2'>
            <BellIcon size={24} color={colors.white} />
          </button>
        </div>
        <div className='relative mr-32 flex w-[152px] flex-1 flex-col items-center'>
          <div className='absolute z-0 h-full w-full rounded-[80px_80px_0_0] bg-gradient-weather opacity-30' />
          <span className='z-10 mt-24 text-12 text-white'>서울시 서대문구</span>
          <span className='z-10 mt-4 flex items-center gap-5 font-jost text-40 font-bold text-white'>
            <Image src='/images/home/icon_cloud.png' alt='Cloud Icon' width={41} height={24} />
            12°
          </span>
        </div>
      </div>
    </header>
  )
}

function SkewedLikeLabel({ like }: { like: number }) {
  return (
    <div className='flex h-28 skew-x-[-10deg] transform items-center justify-center gap-4 rounded-lg border-2 border-black-default bg-white px-8'>
      <Image src='/images/icon_thumbup.png' alt='Thumb Up Icon' width={16} height={16} />
      <span className='font-jost text-16 font-[900]'>{addDelimiter(like)}</span>
    </div>
  )
}
