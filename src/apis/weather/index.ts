import { Geolocation } from '@type/geolocation'

export type RequestType = Geolocation
export type ResponseType = {
  weather: string
  temperature: number
}

export async function fetchCurrentWeather(request: RequestType) {
  const params = new URLSearchParams({
    lat: request.lat.toString(),
    lng: request.lng.toString(),
  })

  const response = await fetch(`/api/weather?${params}`)
  const data: ResponseType = await response.json()
  return data
}
