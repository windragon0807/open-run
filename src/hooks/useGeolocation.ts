import { useEffect, useState } from 'react'

type Geolocation = {
  lat: number
  lng: number
}

export default function useGeolocation() {
  const [location, setLocation] = useState<Geolocation>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('이 브라우저는 위치 정보를 지원하지 않습니다.')
      setLoading(false)
      return
    }

    const getLocation = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            maximumAge: 0,
          })
        })

        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setError(null)
      } catch (err) {
        if (err instanceof GeolocationPositionError) {
          if (err.code === 1) {
            setError('위치 정보 접근 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.')
          } else if (err.code === 2) {
            setError('위치 정보를 가져올 수 없습니다.')
          } else if (err.code === 3) {
            setError('위치 정보 요청 시간이 초과되었습니다.')
          }
        } else {
          setError('위치 정보를 가져오는 중 오류가 발생했습니다.')
        }
        setLocation(undefined)
      } finally {
        setLoading(false)
      }
    }

    getLocation()
  }, [])

  return { location, error, loading }
}
