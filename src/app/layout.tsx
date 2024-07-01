import type { Metadata } from 'next'

import ReactQuery from '@contexts/ReactQuery'
import '@styles/globals.css'

export const metadata: Metadata = {
  title: 'OpenRun',
  description: "OpenRun, Let's run together!",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <body>
        <ReactQuery>{children}</ReactQuery>
      </body>
    </html>
  )
}
