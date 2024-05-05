import { redirect } from 'next/navigation'

import getToken from '@apis/auth/getToken/api'

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

  console.log(response)

  if (response.message === 'success') {
    redirect('/')
  }

  redirect('/signin')
}
