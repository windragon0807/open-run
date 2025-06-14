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
        if (err instanceof GeolocationPositionError) {
          if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
            console.error(
              '[위치 정보 권한 거부] 브라우저 설정에서 위치 정보 접근 권한을 허용해주세요. (에러 코드: PERMISSION_DENIED)',
            )
          } else if (err.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
            console.error(
              '[위치 정보 사용 불가] 현재 위치를 확인할 수 없습니다. 인터넷 연결을 확인하거나 GPS가 켜져있는지 확인해주세요. (에러 코드: POSITION_UNAVAILABLE)',
            )
            /**
             * CoreLocationProvider: CoreLocation framework reported a kCLErrorLocationUnknown failure.
             * macOS 브라우저에서 테스트 시 간헐적으로 발생하는 오류를 커버하기 위함
             */
            if (process.env.NODE_ENV === 'development') {
              console.warn('개발 환경에서는 에러 발생 시 임시 위치 정보 권한 허용')
              setIsGeolocationPermissionGranted(true)
              // 기본 위치(서울시청)로 설정
              setLocation({
                lat: 37.577956,
                lng: 126.916561,
              })
              return
            }
          } else if (err.code === GeolocationPositionError.TIMEOUT) {
            console.error(
              '[위치 정보 요청 시간 초과] 위치 정보를 가져오는 데 너무 오래 걸립니다. 네트워크 상태를 확인해주세요. (에러 코드: TIMEOUT)',
            )
          }
        } else {
          console.error('위치 정보를 가져오는 중 오류가 발생했습니다.')
        }

        setIsGeolocationPermissionGranted(false)
        // 기본 위치(서울시청)로 설정
        setLocation(null)
      }
    }

    getLocation()
  }, [isApp])

  return { location }
}
