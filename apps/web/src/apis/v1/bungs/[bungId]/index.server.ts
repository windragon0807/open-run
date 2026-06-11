import http from '@apis/http.server'
import type { FetchBungDetailResponseType } from './index'

type FetchBungDetailRequestType = {
  bungId: string
}

/** 벙 정보 상세보기 (Server Component 전용) */
export function fetchBungDetail({ bungId }: FetchBungDetailRequestType): Promise<FetchBungDetailResponseType> {
  return http.get(`/v1/bungs/${bungId}`)
}
