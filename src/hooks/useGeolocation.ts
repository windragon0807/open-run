import { useState, useEffect } from 'react'

type Geolocation = {
  latitude: number | null
  longitude: number | null
}

// 위치 권한 요청을 위한 함수
export async function requestGeolocationPermission(): Promise<boolean> {
  if (!navigator.geolocation) {
    return false
  }

  try {
    // iOS Safari를 위한 직접적인 위치 정보 요청
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        (error) => {
          console.error('Geolocation 권한 요청 실패:', error.message)
          if (error.code === 1) {
            // PERMISSION_DENIED
            alert('브라우저 설정에서 위치 권한을 허용해주세요.')
          }
          resolve(false)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000, // 타임아웃 추가
        },
      )
    })
  } catch (error) {
    console.error('Geolocation 권한 요청 중 오류 발생:', error)
    return false
  }
}

export default function useGeolocation() {
  const [location, setLocation] = useState<Geolocation>({
    latitude: null,
    longitude: null,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      return
    }

    // permissions API 사용하지 않고 직접 위치 정보 요청
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        console.error('위치 정보 가져오기 실패:', error.message)
        setLocation({
          latitude: null,
          longitude: null,
        })
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      },
    )
  }, [])

  return location
}
