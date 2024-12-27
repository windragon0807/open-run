'use client'

import { fetchDistance } from '@apis/naver-maps/fetchDistance/api'
import { useQuery } from 'react-query'

export default function MapDistance() {
  const { data } = useQuery({
    queryKey: ['map-distance'],
    queryFn: () =>
      fetchDistance({
        startLat: 37.51957,
        startLng: 127.027964,
        endLat: 37.516263,
        endLng: 127.019895,
      }),
  })

  console.log(data)

  return (
    <div>
      <p>두 지점 사이의 거리: km</p>
    </div>
  )
}
