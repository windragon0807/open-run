import { RequestType, ResponseType } from './type'

export async function fetchDistance(request: RequestType): Promise<ResponseType> {
  const params = new URLSearchParams({
    startLat: request.startLat.toString(),
    startLng: request.startLng.toString(),
    endLat: request.endLat.toString(),
    endLng: request.endLng.toString(),
  })

  const response = await fetch(`/api/map-distance?${params}`)
  const data: NaverMapDistance5Response = await response.json()

  const distance = data?.route?.traoptimal?.[0]?.summary?.distance
  return typeof distance === 'number' ? distance : null
}

type NaverMapDistance5Response = {
  code: number
  currentDateTime: string
  message: string
  route: {
    traoptimal: Array<{
      guide: any
      path: any
      section: any
      summary: {
        distance: number // (m 미터)
      }
    }>
  }
}
