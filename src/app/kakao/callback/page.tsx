import { redirect } from 'next/navigation'

import getToken from '@apis/auth/getToken/api'

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

  console.log(response)

  if (response.message === 'success') {
    redirect('/')
  }

  redirect('/signin')
}
