import { redirect } from 'next/navigation'
import Spacing from '@shared/Spacing'
import Layout from '@shared/Layout'
import FixedBottomMenuButton from '@shared/FixedBottomMenuButton'
import Recommendation from '@components/home/Recommendation'
import MyNFTs from '@components/home/MyNFTs'
import MyBungs from '@components/home/MyBungs'
import Header from '@components/home/Header'
import { fetchUserInfo } from '@apis/users/fetchUserInfo/api'
import Permission from '@components/home/Permission'

export default async function HomePage() {
  const { data: userInfo } = await fetchUserInfo()
  if (userInfo == null) {
    redirect('/signin')
  }

  return (
    <Layout className='bg-gray-lighten'>
      <Permission />
      <div className='h-full overflow-y-auto'>
        <Header nickname={userInfo.nickname} />
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
  )
}
