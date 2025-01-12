'use client'

import { Container, NaverMap, Marker, useNavermaps } from 'react-naver-maps'
import { useGeocode } from '@apis/maps/fetchGeocode/query'
import './map.css'

export default function Map({ location }: { location: string }) {
  const navermaps = useNavermaps()
  const { data: coordinates } = useGeocode(location)

  if (coordinates == null)
    return (
      <Container className='maps' style={{ height: 200 }}>
        <div className='flex items-center justify-center w-full h-full border border-gray'>
          <span className='text-sm text-gray'>지도를 표시할 수 없습니다.</span>
        </div>
      </Container>
    )

  return (
    <Container className='maps' style={{ height: 200 }}>
      <NaverMap defaultCenter={new navermaps.LatLng(Number(coordinates.lat), Number(coordinates.lng))} defaultZoom={15}>
        <Marker defaultPosition={new navermaps.LatLng(Number(coordinates.lat), Number(coordinates.lng))} />
      </NaverMap>
    </Container>
  )
}
