import Image from 'next/image'

export default function NaverLoginButton({ onClick }: { onClick?: () => void }) {
  return (
    <button className='flex gap-8 w-full h-[56px] bg-naver justify-center items-center rounded-8' onClick={onClick}>
      <Image src='/images/icon_naver.png' width={24} height={24} alt='네이버 아이콘' />
      <span className='text-base font-bold text-white'>네이버로 시작하기</span>
    </button>
  )
}
