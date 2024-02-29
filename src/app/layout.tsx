import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import ReactQuery from '@/contexts/ReactQuery'
import GlobalStyle from '@/components/shared/GlobalStyle'
import '@styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OpenRun',
  description: "OpenRun, Let's run together!",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQuery>
          <GlobalStyle>{children}</GlobalStyle>
        </ReactQuery>
      </body>
    </html>
  )
}
