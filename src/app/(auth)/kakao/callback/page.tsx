import { redirect } from 'next/navigation'

import OAuthCallback from '@components/signin/OAuthCallback'
import { fetchToken } from '@apis/users/fetchToken/api'

type Props = {
  searchParams: {
    code: string
  }
}

export default async function KakaoCallbackPage({ searchParams }: Props) {
  const { code } = searchParams

  const response = await fetchToken({
    authServer: 'kakao',
    code,
  })

  if (response.message !== 'success') {
    redirect('/signin')
  }

  return <OAuthCallback nickname={response.data.nickname} jwtToken={response.data.jwtToken} />
}
