import type { Metadata } from 'next'

import DarkMode from '@shared/DarkMode'
import ReactQuery from '@contexts/ReactQuery'
import { ModalContextProvider } from '@contexts/ModalContext'
import '@styles/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <body className='font-pretendard'>
        <DarkMode />
        <ReactQuery>
          <ModalContextProvider>{children}</ModalContextProvider>
        </ReactQuery>
        <div id='root-portal'></div>
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
