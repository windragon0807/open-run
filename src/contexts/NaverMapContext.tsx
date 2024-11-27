'use client'

import { ReactNode } from 'react'
import { NavermapsProvider } from 'react-naver-maps'

export default function NaverMapContext({ children }: { children: ReactNode }) {
  return (
    <NavermapsProvider ncpClientId={process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID} submodules={['geocoder']}>
      {children}
    </NavermapsProvider>
  )
}
