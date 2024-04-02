import { useRouter } from 'next/navigation'
import { useMutation } from 'react-query'

import getToken from '@apis/auth/getToken/api'

export default function useSignin() {
  const router = useRouter()

  const kakaoLogin = () => {
    const redirectUri = `${window.location.origin}/kakao/callback`
    alert(process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID)
    router.push(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code`,
    )
  }

  const naverLogin = () => {
    const redirectUri = `${window.location.origin}/naver/callback`
    router.push(
      `https://nid.naver.com/oauth2.0/authorize?client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}`,
    )
  }

  const { mutateAsync } = useMutation(getToken)

  return { kakaoLogin, naverLogin, getToken: mutateAsync }
}
