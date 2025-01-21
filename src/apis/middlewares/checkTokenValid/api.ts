import { RequestType } from './type'

export async function checkTokenValid({ token }: RequestType): Promise<boolean> {
  try {
    // 토큰 유효성 검증을 위한 API 호출
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/v1/users`, {
      headers: {
        Authorization: token,
      },
    })

    if (!response.ok) {
      // 토큰이 유효하지 않은 경우 로그인 페이지로 리다이렉트
      return false
    }

    return true
  } catch (error) {
    // API 호출 실패 시 로그인 페이지로 리다이렉트
    return false
  }
}
