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
    // 먼저 현재 권한 상태를 확인
    const permission = await navigator.permissions.query({ name: 'geolocation' })

    // 권한이 denied인 경우 사용자에게 안내
    if (permission.state === 'denied') {
      alert('브라우저 설정에서 위치 권한을 허용해주세요.\n설정 > 개인정보 및 보안 > 사이트 설정 > 위치정보')
      return false
    }

    // 권한이 허용된 경우
    if (permission.state === 'granted') {
      return true
    }

    // prompt 상태이거나 다른 상태일 경우 권한 요청
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => {
          resolve(true)
        },
        (error) => {
          // 사용자가 권한 거부 또는 오류 발생
          console.error('Geolocation 권한 요청 실패:', error.message)
          resolve(false)
        },
        {
          enableHighAccuracy: true, // 높은 정확도 요청
          maximumAge: 0, // 캐시된 위치 정보를 사용하지 않음
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
      setLocation((prev) => ({
        ...prev,
        error: '브라우저가 Geolocation을 지원하지 않습니다.',
        loading: false,
      }))
      return
    }

    // 이미 권한이 있는 경우에만 위치 정보 가져오기
    navigator.permissions.query({ name: 'geolocation' }).then((permission) => {
      if (permission.state === 'granted') {
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
      }
    })
  }, [])

  return location
}
