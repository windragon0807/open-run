import { useEffect, useState } from 'react'
import { useAppStore } from '@store/app'
import { usePermissionStore } from '@store/permission'
import { Geolocation } from '@type/geolocation'
import { BridgeMessage, postMessageToRN } from '@shared/AppBridge'
import { MESSAGE } from '@constants/app'

export default function useGeolocation() {
  const { isApp } = useAppStore()
  const { setIsGeolocationPermissionGranted } = usePermissionStore()
  const [location, setLocation] = useState<Geolocation | null>()

  /* 앱에서 위치 정보 요청 */
  useEffect(() => {
    if (!isApp) return
    postMessageToRN({ type: MESSAGE.REQUEST_GEOLOCATION })
  }, [isApp])

  /* 앱에서 위치 정보 수신 */
  useEffect(() => {
    if (!isApp) return

    const onMessageHandler = (event: MessageEvent) => {
      try {
        const parsedMessage = JSON.parse(event.data) as BridgeMessage
        switch (parsedMessage.type) {
          case MESSAGE.GEOLOCATION:
            setLocation(parsedMessage.data as Geolocation)
            setIsGeolocationPermissionGranted(true)
            break
          case MESSAGE.GEOLOCATION_ERROR:
            setLocation(parsedMessage.data as null)
            setIsGeolocationPermissionGranted(false)
            break
        }
      } catch (error) {
        console.error('메시지 파싱 오류:', error)
      }
    }

    // iOS와 Android 모두 지원하기 위해 window와 document에 이벤트 리스너 추가
    window.addEventListener('message', onMessageHandler as EventListener)
    document.addEventListener('message', onMessageHandler as EventListener)

    return () => {
      window.removeEventListener('message', onMessageHandler as EventListener)
      document.removeEventListener('message', onMessageHandler as EventListener)
    }
  }, [isApp])

  /* 브라우저에서 위치 정보 요청 */
  useEffect(() => {
    if (isApp) return

    if (!navigator.geolocation) {
      console.error('이 브라우저는 위치 정보를 지원하지 않습니다.')
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

        setIsGeolocationPermissionGranted(true)
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        console.info('위치 정보 수신:', { lat: position.coords.latitude, lng: position.coords.longitude })
      } catch (err) {
        setIsGeolocationPermissionGranted(false)
        if (err instanceof GeolocationPositionError) {
          if (err.code === 1) {
            console.error('위치 정보 접근 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.')
          } else if (err.code === 2) {
            console.error('위치 정보를 가져올 수 없습니다.')
          } else if (err.code === 3) {
            console.error('위치 정보 요청 시간이 초과되었습니다.')
          }
        } else {
          console.error('위치 정보를 가져오는 중 오류가 발생했습니다.')
        }
        setLocation(null)
      }
    }

    getLocation()
  }, [isApp])

  return { location }
}
