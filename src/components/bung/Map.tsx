'use client'

import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'
import { Container, Marker, NaverMap, useNavermaps } from 'react-naver-maps'
import { useGeocode } from '@apis/maps/fetchGeocode/query'

function Map({ location }: { location: string }) {
  const navermaps = useNavermaps()
  const { data: coordinates } = useGeocode(location)

  if (coordinates == null)
    return (
      <div className='relative h-200 w-full animate-pulse'>
        <Image className='object-cover' src='/images/maps/map_placeholder.png' alt='map' fill />
        <Link
          href={`https://map.naver.com/v5/search/${encodeURIComponent(location)}`}
          target='_blank'
          rel='noopener noreferrer'
          className='bg-black/50 hover:bg-black/60 absolute inset-0 flex items-center justify-center text-white transition-colors'
        />
      </div>
    )

  return (
    <Container className='[&>div]:rounded-lg' style={{ height: 200 }}>
      <NaverMap defaultCenter={new navermaps.LatLng(coordinates.lat, coordinates.lng)} defaultZoom={15}>
        <Marker
          defaultPosition={new navermaps.LatLng(coordinates.lat, coordinates.lng)}
          icon={{
            url: '/images/maps/marker_destination.png',
            size: new navermaps.Size(22, 34),
            scaledSize: new navermaps.Size(22, 34),
            origin: new navermaps.Point(0, 0),
            anchor: new navermaps.Point(11, 42),
          }}
        />
      </NaverMap>
    </Container>
  )
}

export default memo(Map)
