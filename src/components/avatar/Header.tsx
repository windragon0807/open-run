import Image from 'next/image'

export default function Header() {
  return (
    <header className='h-[60px] flex justify-between items-center px-5'>
      <button>
        <Image src='/icons/back.svg' alt='뒤로가기' width={24} height={24} />
      </button>
      <h1 className='text-lg font-semibold'>저장 버튼</h1>
      <button className='bg-primary text-white px-4 py-2 rounded'>저장</button>
    </header>
  )
}
