import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import ReactQuery from '@contexts/ReactQuery'
import Layout from '@components/shared/Layout'
import '@styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OpenRun',
  description: "OpenRun, Let's run together!",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <body className={inter.className}>
        <ReactQuery>
          <Layout>{children}</Layout>
        </ReactQuery>
      </body>
    </html>
  )
}
