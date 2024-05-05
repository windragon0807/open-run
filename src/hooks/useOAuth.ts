import { useRouter } from 'next/navigation'

export default function useSignin() {
  const router = useRouter()

  const kakaoLogin = () => {
    const redirectUri = `${window.location.origin}/kakao/callback`
    router.push(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code`,
    )
  }

  const naverLogin = () => {
    const redirectUri = `${window.location.origin}/naver/callback`
    router.push(
      `https://nid.naver.com/oauth2.0/authorize?client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code`,
    )
  }

  return { kakaoLogin, naverLogin }
}
