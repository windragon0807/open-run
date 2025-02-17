import type { Metadata, Viewport } from 'next'
import { Jost } from 'next/font/google'

import ReactQuery from '@contexts/ReactQuery'
import NaverMapContext from '@contexts/NaverMapContext'
import { ModalContext } from '@contexts/ModalContext'
import DarkMode from '@shared/DarkMode'
import AppBridge from '@shared/AppBridge'
import '@styles/globals.css'

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <body className={`font-pretendard ${jost.variable} touch-none`}>
        <DarkMode />
        <ReactQuery>
          <ModalContext>
            <NaverMapContext>
              <AppBridge>{children}</AppBridge>
            </NaverMapContext>
          </ModalContext>
        </ReactQuery>
        <div id='root-portal' />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: {
    template: '%s | OpenRun',
    default: 'OpenRun',
  },
  description: "OpenRun, Let's run together!",
  other: {
    /* Allow web app to be run in full-screen mode - iOS. */
    'apple-mobile-web-app-capable': 'yes',
    /* Allow web app to be run in full-screen mode - Android. */
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
}
