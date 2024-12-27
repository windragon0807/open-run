import { RequestType, ResponseType } from './type'

export async function fetchDistance(request: RequestType): Promise<ResponseType> {
  const params = new URLSearchParams({
    startLat: request.startLat,
    startLng: request.startLng,
    endLat: request.endLat,
    endLng: request.endLng,
  })

  const response = await fetch(`/api/distance?${params}`)
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
      guide: unknown
      path: unknown
      section: unknown
      summary: {
        distance: number // (m 미터)
      }
    }>
  }
}
