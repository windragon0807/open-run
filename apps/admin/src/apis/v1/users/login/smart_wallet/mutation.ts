import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { smartWalletLogin } from '@openrun/api-client/auth'
import { COOKIE } from '@openrun/api-client/constants'
import { setCookie } from '@openrun/api-client/cookie'

export function useSmartWalletLogin() {
  const router = useRouter()
  return useMutation({
    mutationFn: smartWalletLogin,
    onSuccess: ({ data }) => {
      setCookie(COOKIE.ACCESSTOKEN, data.jwtToken, 60 * 60 * 6)
      router.replace('/')
    },
  })
}
