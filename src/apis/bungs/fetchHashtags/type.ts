import { ApiResponse } from '@apis/axios'

export type RequestType = {
  tag: string
}

export type ResponseType = ApiResponse<string[]>
