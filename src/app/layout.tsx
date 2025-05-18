import type { Metadata, Viewport } from 'next'
import { Jost } from 'next/font/google'
import { ModalContext } from '@contexts/ModalContext'
import NaverMapContext from '@contexts/NaverMapContext'
import ReactQuery from '@contexts/ReactQuery'
import { WalletProvider } from '@components/shared/WalletProvider'
import AlertPortal from '@shared/Alert'
import AppBridge from '@shared/AppBridge'
import { ROOT_PORTAL_ID } from '@constants/layout'
import '@styles/globals.css'

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <body className={`font-pretendard ${jost.variable} touch-none`}>
        <ReactQuery>
          <WalletProvider>
            <ModalContext>
              <NaverMapContext>
                <AppBridge>{children}</AppBridge>
              </NaverMapContext>
            </ModalContext>
          </WalletProvider>
        </ReactQuery>
        <div id={ROOT_PORTAL_ID} />
        <AlertPortal />
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
