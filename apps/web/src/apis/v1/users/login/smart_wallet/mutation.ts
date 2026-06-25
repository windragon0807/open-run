import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAnalytics } from '@analytics'
import { setCookie } from '@utils/cookie'
import { COOKIE } from '@constants/cookie'
import { smartWalletLogin } from './index'

export function useSmartWalletLogin() {
  const router = useRouter()
  return useMutation({
    mutationFn: smartWalletLogin,
    onSuccess: ({ data }) => {
      const { jwtToken, nickname } = data
      setCookie(COOKIE.ACCESSTOKEN, jwtToken, 60 * 60 * 6) // 6시간
      authAnalytics.walletLoginSucceeded({ hasNickname: nickname != null })
      router.push(nickname == null ? '/register' : '/')
    },
    onError: () => {
      authAnalytics.walletLoginFailed()
    },
  })
}
