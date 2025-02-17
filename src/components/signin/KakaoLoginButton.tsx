import Image from 'next/image'

export default function KakaoLoginButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className='flex gap-8 w-full h-[56px] bg-kakao hover:bg-kakao/80 justify-center items-center rounded-8'
      onClick={onClick}>
      <Image src='/images/icon_kakao.png' width={24} height={24} alt='카카오 아이콘' />
      <span className='text-base font-bold'>카카오톡으로 시작하기</span>
    </button>
  )
}
