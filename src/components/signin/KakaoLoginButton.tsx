import Image from 'next/image'

export default function KakaoLoginButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className='flex h-[56px] w-full items-center justify-center gap-8 rounded-8 bg-kakao hover:bg-kakao/80'
      onClick={onClick}>
      <Image src='/images/icon_kakao.png' width={24} height={24} alt='카카오 아이콘' />
      <span className='text-16 font-bold'>카카오톡으로 시작하기</span>
    </button>
  )
}
