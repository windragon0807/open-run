import Layout from '@/components/shared/Layout'
import Explore from '@components/explore/Explore'
import AuthGuard from '@shared/AuthGuard'

export default function Page() {
  return (
    <AuthGuard>
      <Layout>
        <Explore />
      </Layout>
    </AuthGuard>
  )
}
