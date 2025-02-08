'use client'

import { useEffect } from 'react'
import { checkGeolocationPermission, requestGeolocationPermission } from '@hooks/usePermission'
import { usePermissionStore } from '@store/permission'

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

        setGeolocation(true)
      } catch (error) {
        console.error('권한 확인 중 오류 발생:', error)
        setGeolocation(false)
      }
    }

    checkPermission()
  }, [setGeolocation])

  return null
}
