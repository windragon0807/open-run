'use client'

import { Container, NaverMap as Map, Marker, useNavermaps } from 'react-naver-maps'
import { useQuery } from 'react-query'
import { fetchGeocode } from '@apis/maps/fetchGeocode/api'
import './map.css'

export default function NaverMap({
  location,
  curCoordinates,
}: {
  location: string
  curCoordinates?: [string, string]
}) {
  const navermaps = useNavermaps()
  const { data: coordinates } = useQuery({
    queryKey: ['geocode', location],
    queryFn: () => fetchGeocode({ address: location }),
  })

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
      <Map defaultCenter={new navermaps.LatLng(Number(coordinates.lat), Number(coordinates.lng))} defaultZoom={15}>
        <Marker defaultPosition={new navermaps.LatLng(Number(coordinates.lat), Number(coordinates.lng))} />
        {curCoordinates && (
          <Marker defaultPosition={new navermaps.LatLng(Number(curCoordinates[0]), Number(curCoordinates[1]))} />
        )}
      </Map>
    </Container>
  )
}
