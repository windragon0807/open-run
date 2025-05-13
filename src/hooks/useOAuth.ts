import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { smartWalletLogin } from '@apis/users/smartWalletLogin/api'
import { COOKIE } from '@constants/cookie'

export default function useSignin() {
  const router = useRouter()
  const { address } = useAccount()

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

  const handleSmartWalletLogin = async () => {
    if (!address) return

    try {
      // Call our backend through the API with just the wallet address
      const response = await smartWalletLogin({
        code: address,
      })

      // Set the JWT token in cookies
      document.cookie = `${COOKIE.ACCESSTOKEN}=${response.data.jwtToken}; path=/`
      
      // Redirect based on whether the user needs to register
      router.push(response.data.nickname == null ? '/register' : '/')
    } catch (error) {
      console.error('Smart wallet login failed:', error)
    }
  }

  return { kakaoLogin, naverLogin, smartWalletLogin: handleSmartWalletLogin }
}
