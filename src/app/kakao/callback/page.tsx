import { redirect } from 'next/navigation'

import { getToken } from '@apis/auth/getToken/api'
import OAuthCallback from '@components/signin/OAuthCallback'

type Props = {
  searchParams: {
    code: string
  }
}

export default async function KakaoCallbackPage({ searchParams }: Props) {
  const { code } = searchParams

  const response = await getToken({
    authServer: 'kakao',
    code,
  })

  if (response.message !== 'success') {
    redirect('/signin')
  }

  return <OAuthCallback nickname={response.data.nickname} jwtToken={response.data.jwtToken} />
}
