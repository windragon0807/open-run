import { UseQueryOptions } from 'react-query/types/react/types'
import { AxiosError } from 'axios'

export type ApiResponse<DataType> = {
  message: string
  data: DataType
}

export type QueryOptions<ResponseType, DataType = unknown> = UseQueryOptions<ResponseType, AxiosError, DataType>

export type Pagination = {
  totalPages: number
  totalElements: number
  first: boolean
  last: boolean
  empty: boolean
}

export type PaginationResponse<DataType> = Pagination & ApiResponse<DataType>
