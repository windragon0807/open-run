import { ApiResponse } from '@apis/axios'
import { MainCategory, SubCategory } from '@/types/avatar'

export type RequestType = {}

export type ResponseType = ApiResponse<
  Array<{
    id: string
    imageUrl: string
    rarity: string
    name: string
    mainCategory: MainCategory
    subCategory: SubCategory | null
    link: string
  }>
>
