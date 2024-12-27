'use client'

import { useEffect, useState } from 'react'
import { Container, NaverMap as Map, Marker, useNavermaps } from 'react-naver-maps'

import './map.css'

type Coordinates = { lat: number; lng: number }

export default function NaverMap({ location }: { location: string }) {
  const navermaps = useNavermaps()
  const [coordinates, setCoordinates] = useState<Coordinates>()

  useEffect(() => {
    console.log(naver.maps.Service)
    naver.maps.Service.geocode({ query: location }, (_, response) => {
      if (response.v2.addresses.length > 0) {
        setCoordinates({
          lat: Number(response.v2.addresses[0].y),
          lng: Number(response.v2.addresses[0].x),
        })
      }
    })
  }, [location])

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
      <Map defaultCenter={new navermaps.LatLng(coordinates.lat, coordinates.lng)} defaultZoom={15}>
        <Marker defaultPosition={new navermaps.LatLng(coordinates.lat, coordinates.lng)} />
      </Map>
    </Container>
  )
}
