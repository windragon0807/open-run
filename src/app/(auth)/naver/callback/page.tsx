import { redirect } from 'next/navigation'

import OAuthCallback from '@components/signin/OAuthCallback'
import { fetchToken } from '@apis/users/fetchToken/api'

type Props = {
  searchParams: {
    code: string
    state: string
  }
}

export default async function NaverCallbackPage({ searchParams }: Props) {
  const { code, state } = searchParams

  const response = await fetchToken({
    authServer: 'naver',
    code,
    state,
  })

  if (response.message !== 'success') {
    redirect('/signin')
  }

  return <OAuthCallback nickname={response.data.nickname} jwtToken={response.data.jwtToken} />
}
