'use client'

import { Container, NaverMap, Marker, useNavermaps } from 'react-naver-maps'

import './map.css'

export default function NaverMapComponent() {
  const navermaps = useNavermaps()

  return (
    <Container className='maps' style={{ height: 200 }}>
      <NaverMap defaultCenter={new navermaps.LatLng(37.3595704, 127.105399)} defaultZoom={15}>
        <Marker defaultPosition={new navermaps.LatLng(37.3595704, 127.105399)} />
      </NaverMap>
    </Container>
  )
}
