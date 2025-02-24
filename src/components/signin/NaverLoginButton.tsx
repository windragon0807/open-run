import Image from 'next/image'

export default function NaverLoginButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className='flex h-56 w-full items-center justify-center gap-8 rounded-8 bg-naver hover:bg-naver/80'
      onClick={onClick}>
      <Image src='/images/icon_naver.png' width={24} height={24} alt='네이버 아이콘' />
      <span className='text-16 font-bold text-white'>네이버로 시작하기</span>
    </button>
  )
}
