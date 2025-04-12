import { UseQueryOptions, useQuery } from 'react-query'

type Request = {
  lat: number
  lng: number
}

type NaverMapReverseGeocodeResponse = {
  status: {
    code: number
    message: string
    name: string
  }
  results: Array<{
    name: string
    code: unknown
    region: {
      area0: {
        name: string // 'kr'
        coords: unknown
      }
      area1: {
        alias: string // 서울
        name: string // 서울특별시
        coords: unknown
      }
      area2: {
        name: string // 서대문구
        coords: unknown
      }
      area3: {
        name: string // 남가좌동
        coords: unknown
      }
      area4: unknown
    }
  }>
}

type Response = {
  location: string[] // ['서울특별시', '서대문구', '남가좌동']
}

export async function fetchReverseGeocode(request: Request): Promise<Response> {
  const params = new URLSearchParams({
    lat: request.lat.toString(),
    lng: request.lng.toString(),
  })

  const response = await fetch(`/api/reverse-geocode?${params}`)
  const data: NaverMapReverseGeocodeResponse = await response.json()
  const area1 = data.results[0].region.area1.name
  const area2 = data.results[0].region.area2.name
  const area3 = data.results[0].region.area3.name

  return {
    location: [area1, area2, area3],
  }
}

export function useReverseGeocode(request: Request, options?: UseQueryOptions<Response>) {
  return useQuery({
    queryKey: ['reverse-geocode', request],
    queryFn: () => fetchReverseGeocode(request),
    staleTime: Infinity,
    cacheTime: Infinity,
    ...options,
  })
}
