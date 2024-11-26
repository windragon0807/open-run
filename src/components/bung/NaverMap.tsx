'use client'

import { useState } from 'react'
import { Container, NaverMap, Marker, useNavermaps } from 'react-naver-maps'

import './map.css'

export default function NaverMapComponent({ location }: { location: string }) {
  const navermaps = useNavermaps()
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 37.3595704,
    lng: 127.105399,
  })

  return (
    <Container className='maps' style={{ height: 200 }}>
      <NaverMap defaultCenter={new navermaps.LatLng(coordinates.lat, coordinates.lng)} defaultZoom={15}>
        <Marker defaultPosition={new navermaps.LatLng(coordinates.lat, coordinates.lng)} />
      </NaverMap>
    </Container>
  )
}
