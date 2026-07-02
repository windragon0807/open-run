import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authAnalytics } from '@analytics'
import { setCookie } from '@utils/cookie'
import { COOKIE } from '@constants/cookie'
import { ACCESS_TOKEN_MAX_AGE_SECONDS } from '@openrun/api-client/constants'
import { smartWalletLogin } from './index'

export function useSmartWalletLogin() {
  const router = useRouter()
  return useMutation({
    mutationFn: smartWalletLogin,
    onSuccess: ({ data }) => {
      const { jwtToken, nickname } = data
      setCookie(COOKIE.ACCESSTOKEN, jwtToken, ACCESS_TOKEN_MAX_AGE_SECONDS)
      authAnalytics.walletLoginSucceeded({ hasNickname: nickname != null })
      router.replace(nickname == null ? '/register' : '/')
    },
    onError: () => {
      authAnalytics.walletLoginFailed()
    },
  })
}
