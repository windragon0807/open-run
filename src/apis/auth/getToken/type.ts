export type RequestType = {
  authServer: 'kakao' | 'naver'
  code: string
  state?: string
}

export type ResponseType = {
  message: string
  data: {
    email: string
    nickname: string
    jwtToken: string
  }
}
