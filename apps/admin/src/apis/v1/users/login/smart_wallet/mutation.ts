import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { smartWalletLogin } from '@openrun/api-client/auth'
import { ACCESS_TOKEN_MAX_AGE_SECONDS, COOKIE } from '@openrun/api-client/constants'
import { setCookie } from '@openrun/api-client/cookie'

export function useSmartWalletLogin() {
  const router = useRouter()
  return useMutation({
    mutationFn: smartWalletLogin,
    onSuccess: ({ data }) => {
      setCookie(COOKIE.ACCESSTOKEN, data.jwtToken, ACCESS_TOKEN_MAX_AGE_SECONDS)
      router.replace('/')
    },
  })
}
