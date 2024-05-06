import { redirect } from 'next/navigation'

import { getToken } from '@apis/auth/getToken/api'
import OAuthCallback from '@components/signin/OAuthCallback'

type Props = {
  searchParams: {
    code: string
    state: string
  }
}

export default async function NaverCallbackPage({ searchParams }: Props) {
  const { code, state } = searchParams

  const response = await getToken({
    authServer: 'naver',
    code,
    state,
  })

  if (response.message !== 'success') {
    redirect('/signin')
  }

  return <OAuthCallback nickname={response.data.nickname} jwtToken={response.data.jwtToken} />
}
