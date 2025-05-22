'use client'

import { APIProvider } from '@vis.gl/react-google-maps'
import { type ReactNode } from 'react'

const API_KEY = 'AIzaSyDEYLiAvcL-MChUfadGX8UvVRHBUBpp040'

export default function GoogleMapContext({ children }: { children: ReactNode }) {
  return <APIProvider apiKey={API_KEY}>{children}</APIProvider>
}
