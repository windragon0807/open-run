import http from '@apis/axios'
import { ApiResponse } from '@apis/type'

type RequestType = {
  challengeId: number
}

type ResponseType = ApiResponse<{
  tokenId: number
  name: string
  description: string
  image: string
  category: string
  rarity: string
}>

export function mintNFT({ challengeId }: RequestType): Promise<ResponseType> {
  return http.post(`/v1/nft/mint?challengeId=${challengeId}`)
}
