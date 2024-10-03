import Link from 'next/link'

import BackIcon from '@icons/BackIcon'

export default function Header() {
  return (
    <header className='relative w-full h-60 flex justify-center items-center px-5 bg-black-darken'>
      <Link href='/' className='absolute left-16'>
        <BackIcon color='white' />
      </Link>
      <h1 className='text-[16px] font-bold text-white'>아바타 변경</h1>
    </header>
  )
}
