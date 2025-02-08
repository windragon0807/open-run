import AuthGuard from '@shared/AuthGuard'
import Spacing from '@shared/Spacing'
import Layout from '@shared/Layout'
import FixedBottomMenuButton from '@shared/FixedBottomMenuButton'
import Recommendation from '@components/home/Recommendation'
import MyNFTs from '@components/home/MyNFTs'
import MyBungs from '@components/home/MyBungs'
import Header from '@components/home/Header'
import Permission from '@components/home/Permission'

export default async function HomePage() {
  return (
    <AuthGuard>
      <Layout className='bg-gray-lighten'>
        <Permission />
        <div className='h-full overflow-y-auto'>
          <Header />
          <Spacing size={95} />
          <MyNFTs />
          <Spacing size={40} />
          {/* 참여 예정 */}
          <MyBungs />
          <Spacing size={40} />
          {/* 추천 */}
          <Recommendation />
          <Spacing size={40} />
        </div>
        <FixedBottomMenuButton />
      </Layout>
    </AuthGuard>
  )
}
