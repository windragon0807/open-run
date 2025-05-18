import { useRouter } from 'next/navigation'
import { useMutation } from 'react-query'
import { setCookie } from '@utils/cookie'
import { COOKIE } from '@constants/cookie'
import { smartWalletLogin } from './index'

export function useSmartWalletLogin() {
  const router = useRouter()
  return useMutation({
    mutationFn: smartWalletLogin,
    onSuccess: ({ data }) => {
      const { jwtToken, nickname } = data
      setCookie(COOKIE.ACCESSTOKEN, jwtToken)
      router.push(nickname == null ? '/register' : '/')
    },
  })
}
