import { useMutation } from 'react-query'
import http from '@apis/axios'

type RequestType = {
  walletAddress: string
}

function updateWalletAddress({ walletAddress }: RequestType) {
  return http.patch(`/v1/users/wallet?walletAddress=${walletAddress}`)
}

export function useUpdateWalletAddress() {
  return useMutation(updateWalletAddress)
}
