import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import http from '@apis/axios'

type RequestType = {
  bungId: string
}

function completeBung({ bungId }: RequestType) {
  return http.patch(`/v1/bungs/${bungId}/complete`)
}

interface UseCompleteBungOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export function useCompleteBung(options?: UseCompleteBungOptions) {
  const mutation = useMutation({
    mutationFn: completeBung,
  })

  useEffect(() => {
    if (mutation.isSuccess && mutation.data && options?.onSuccess) {
      options.onSuccess(mutation.data)
    }
  }, [mutation.isSuccess, mutation.data, options?.onSuccess])

  useEffect(() => {
    if (mutation.isError && mutation.error && options?.onError) {
      options.onError(mutation.error)
    }
  }, [mutation.isError, mutation.error, options?.onError])

  return mutation
}
