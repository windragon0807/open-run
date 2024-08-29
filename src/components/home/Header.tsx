import BellIcon from '@components/icons/BellIcon'
import Avartar from './Avartar'

export default function Header() {
  return (
    <header className='fixed z-[100] bg-gray-lighten w-full max-w-tablet h-84 flex justify-between p-[16px_12px_16px_16px]'>
      <div className='flex flex-col'>
        <span className='text-[12px] leading-[16px] tracking-[-0.24px]'>칭호가 들어갑니다</span>
        <span className='text-[28px] leading-[36px] tracking-[-0.56px] font-bold'>Username</span>
      </div>
      <div className='flex items-center gap-[13px]'>
        <BellIcon />
        <Avartar imageSrc='/temp/nft_character_sm.png' size={40} />
      </div>
    </header>
  )
}
