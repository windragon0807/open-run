import { UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export type QueryOptions<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> & {
  onSuccess?: (data: T) => void
  onError?: (error: AxiosError<T>) => void
}
