import KakaoLogo from '@shared/icons/KakaoLogo'

export default function KakaoLoginButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className='flex gap-[25px] w-[230px] h-[46px] bg-kakao justify-center items-center rounded-[40px]'
      onClick={onClick}>
      <KakaoLogo />
      <span className='text-base font-semibold'>카카오로 로그인</span>
    </button>
  )
}
