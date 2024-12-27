'use client'

import useGeolocation from '@hooks/useGeolocation'

export default function MapDistance() {
  const { latitude, longitude } = useGeolocation()

  console.log(latitude, longitude)

  return (
    <div>
      <p>
        현재 위치: {latitude}, {longitude}
      </p>
    </div>
  )
}
