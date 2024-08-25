import { ApiResponse } from '@apis/axios'

export type RequestType = {
  nickname: string
}

export type ResponseType = ApiResponse<boolean>
