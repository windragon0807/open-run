import Link from 'next/link'

export default function Header({ onSaveButtonClick }: { onSaveButtonClick: () => void }) {
  return (
    <header className='relative w-full h-60 flex justify-center items-center px-5 bg-white z-20'>
      <Link href='/' className='absolute left-16'>
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
          <path d='M11.4 12L16 7.4L14.6 6L8.6 12L14.6 18L16 16.6L11.4 12Z' fill='#222222' />
        </svg>
      </Link>
      <h1 className='text-[16px] font-bold text-black'>아바타 변경</h1>
      <button className='absolute right-16' onClick={onSaveButtonClick}>
        <span className='text-sm text-black'>저장</span>
      </button>
    </header>
  )
}
