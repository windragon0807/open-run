import { UseQueryOptions, useQuery } from 'react-query'

type Request = {
  lat: number
  lng: number
}

type OpenWeatherCurrentWeatherResponse = {
  current: {
    clouds: number
    dew_point: number
    dt: string
    feels_like: number
    humidity: number
    pressure: number
    snow: { '1h': number }
    sunrise: number
    sunset: number
    temp: number /* 온도 */
    uvi: number
    visibility: Number
    weather: Array<{
      id: number
      main: string /* 날씨  */
      description: string
      icon: string
    }>
    wind_deg: number
    wind_speed: number
  }
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
}

type Response = {
  weather: string
  temperature: number
}

export async function fetchCurrentWeather(request: Request): Promise<Response> {
  const params = new URLSearchParams({
    lat: request.lat.toString(),
    lng: request.lng.toString(),
  })

  const response = await fetch(`/api/weather?${params}`)
  const data: OpenWeatherCurrentWeatherResponse = await response.json()

  return {
    weather: data.current.weather[0].main,
    temperature: data.current.temp,
  }
}

export function useCurrentWeather(request: Request, options?: UseQueryOptions<Response>) {
  return useQuery({
    queryKey: ['current-weather', request],
    queryFn: () => fetchCurrentWeather(request),
    staleTime: 1_000 * 60 * 60, // 1시간
    cacheTime: 1_000 * 60 * 60, // 1시간
    ...options,
  })
}
