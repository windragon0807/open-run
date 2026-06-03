import { useMutation } from '@tanstack/react-query'
import { MintJobResponseType, StartMintJobRequestType, startMintJob } from './index'

export function useStartMintJobMutation() {
  return useMutation<MintJobResponseType, Error, StartMintJobRequestType>({
    mutationFn: startMintJob,
  })
}
