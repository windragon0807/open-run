import type { Metadata } from 'next'

import ReactQuery from '@contexts/ReactQuery'
import Layout from '@components/shared/Layout'
import '@styles/globals.css'

export const metadata: Metadata = {
  title: 'OpenRun',
  description: "OpenRun, Let's run together!",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <body>
        <ReactQuery>
          <Layout>{children}</Layout>
        </ReactQuery>
      </body>
    </html>
  )
}
