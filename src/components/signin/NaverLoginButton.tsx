import NaverLogo from '@shared/icons/NaverLogo'

type Props = {
  onClick?: () => void
}

export default function NaverLoginButton({ onClick }: Props) {
  return (
    <button
      className="flex gap-[15px] w-[230px] h-[46px] bg-naver justify-center items-center rounded-[40px]"
      onClick={onClick}>
      <NaverLogo />
      <span className="text-base font-semibold text-white">네이버로 로그인</span>
    </button>
  )
}
