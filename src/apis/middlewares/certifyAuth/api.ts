import qs from 'qs'
import { RequestType, ResponseType } from './type'

/**
 * 유저 로그인 성공 시 정보 반환
 * # 헤더에 Authorization 토큰 넣어서 보내면 400 에러 뱉음
 */
export async function certifyAuth(params: RequestType): Promise<ResponseType> {
  const queryParams = qs.stringify({
    code: params.code,
    ...(params.state && { state: params.state }),
  })

  const url = `${process.env.NEXT_PUBLIC_API_SERVER_URL}/v1/users/login/${params.authServer}?${queryParams}`
  try {
    console.log(`🚀 [Middleware] [Request] [GET] ${url}`)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.log(`🚨 [Middleware] [Response] ${url}`, response.status)
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    console.log(`🎁 [Middleware] [Response] ${url}`, JSON.stringify(data, null, 2))
    return data
  } catch (error) {
    console.log(`🚨 [Middleware] [Response] ${url}`, error)
    throw error
  }
}
