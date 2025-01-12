'use client'

import { useEffect } from 'react'
import { requestGeolocationPermission } from '@hooks/useGeolocation'

export default function PrePermissions() {
  useEffect(() => {
    requestGeolocationPermission().then((result) => {
      if (result === true) {
        console.log('위치 권한 허용')
      } else {
        console.log('위치 권한 거부')
      }
    })
  }, [])

  return null
}
