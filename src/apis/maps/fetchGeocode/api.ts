import { RequestType, ResponseType } from './type'

export async function fetchGeocode(request: RequestType): Promise<ResponseType> {
  const params = new URLSearchParams({
    address: request.address,
  })

  const response = await fetch(`/api/geocode?${params}`)
  const data: NaverMapGeocodeResponse = await response.json()

  return {
    lng: data.addresses[0].x,
    lat: data.addresses[0].y,
  }
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
