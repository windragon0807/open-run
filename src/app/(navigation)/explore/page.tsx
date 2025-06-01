import { Metadata } from 'next'
import Explore from '@components/explore/Explore'
import AuthGuard from '@shared/AuthGuard'
import Layout from '@shared/Layout'

export default function Page() {
  return (
    <AuthGuard>
      <Layout>
        <Explore />
      </Layout>
    </AuthGuard>
  )
}

export const metadata: Metadata = {
  title: '탐색',
}
