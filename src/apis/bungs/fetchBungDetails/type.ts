import { ApiResponse } from '@apis/axios'
import { BungDetail } from '@/types/bung'

export type RequestType = {
  bungId: string
}

export type ResponseType = ApiResponse<BungDetail>
