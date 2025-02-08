import { ApiResponse } from '@apis/axios'
import { BungDetail } from '@type/bung'

export type RequestType = {
  bungId: string
}

export type ResponseType = ApiResponse<BungDetail>
