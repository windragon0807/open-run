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
