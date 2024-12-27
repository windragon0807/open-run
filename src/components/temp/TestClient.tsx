'use client'

import { fetchGeocode } from '@apis/maps/fetchGeocode/api'
import { useQuery } from 'react-query'

export default function TestClient() {
  const { data } = useQuery({
    queryKey: ['geocode'],
    queryFn: () => fetchGeocode({ address: '서울특별시 종로구 종로3길 17' }),
  })

  console.log(data)

  return <div>TestClient</div>
}
