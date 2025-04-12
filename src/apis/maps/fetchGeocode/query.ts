import { useQuery } from 'react-query'

export type RequestType = {
  address: string
}

type NaverMapGeocodeResponse = {
  addresses: Array<{
    addressElements: Array<unknown>
    distance: number
    englishAddress: string
    jibunAddress: string
    roadAddress: string
    x: string // lng (경도)
    y: string // lat (위도)
  }>
  errorMessage: string
  meta: {
    count: number
    page: number
    totalCount: number
  }
  status: string
}

export type ResponseType = {
  lat: number
  lng: number
}

export async function fetchGeocode(request: RequestType): Promise<ResponseType> {
  const params = new URLSearchParams({
    address: request.address,
  })

  const response = await fetch(`/api/geocode?${params}`)
  const data: NaverMapGeocodeResponse = await response.json()

  return {
    lng: Number(data.addresses[0].x),
    lat: Number(data.addresses[0].y),
  }
}

export function useGeocode(location: string) {
  return useQuery({
    queryKey: ['geocode', location],
    queryFn: () => fetchGeocode({ address: location }),
    staleTime: Infinity,
    cacheTime: Infinity,
  })
}
