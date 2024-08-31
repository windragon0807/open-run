import { ApiResponse } from '@apis/axios'

export type ResponseType = ApiResponse<{
  nfTokenId: string
  taxon: any
  nftSerial: string
  decodedUri: string
  decodedMemoData: string
}>
