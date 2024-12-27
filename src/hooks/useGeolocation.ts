import { useState, useEffect } from 'react'

type Geolocation = {
  latitude: number | null
  longitude: number | null
}

export default function useGeolocation() {
  const [location, setLocation] = useState<Geolocation>({
    latitude: null,
    longitude: null,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: '브라우저가 Geolocation을 지원하지 않습니다.',
        loading: false,
      }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => {
        setLocation({
          latitude: null,
          longitude: null,
        })
      },
    )
  }, [])

  return location
}
