'use client'

import { useEffect } from 'react'
import { usePermissionStore } from '@store/permission'
import { checkGeolocationPermission, requestGeolocationPermission } from '@hooks/usePermission'

export default function Permission() {
  const { setGeolocation } = usePermissionStore()

  useEffect(() => {
    const checkPermission = async () => {
      try {
        // 현재 위치 권한 상태 확인
        const hasPermission = await checkGeolocationPermission()
        if (!hasPermission) {
          // 권한이 없는 경우 권한 요청
          const permissionGranted = await requestGeolocationPermission()
          if (!permissionGranted) {
            console.log('위치 권한이 거부되었습니다.')
            setGeolocation(false)
            return
          }
        }

        // 위치 정보 조회 시 타임아웃 설정
        const positionPromise = new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('위치 정보 조회 시간 초과'))
          }, 10000) // 10초 타임아웃

          navigator.geolocation.getCurrentPosition(
            (position) => {
              clearTimeout(timeoutId)
              resolve(position)
            },
            (error) => {
              clearTimeout(timeoutId)
              reject(error)
            },
            {
              enableHighAccuracy: true, // 높은 정확도 사용
              maximumAge: 0, // 캐시된 위치 정보를 사용하지 않음
              timeout: 10000, // 10초 타임아웃
            },
          )
        })

        await positionPromise
        setGeolocation(true)
      } catch (error) {
        console.error('위치 정보 조회 중 오류 발생:', error)
        setGeolocation(false)

        // 사용자에게 오류 상황 알림
        if (error instanceof GeolocationPositionError) {
          if (error.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
            alert('현재 위치를 확인할 수 없습니다. GPS 신호가 약하거나 위치 서비스가 비활성화되어 있는지 확인해주세요.')
          } else if (error.code === GeolocationPositionError.TIMEOUT) {
            alert('위치 정보 조회 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.')
          }
        }
      }
    }

    checkPermission()
  }, [setGeolocation])

  return null
}
