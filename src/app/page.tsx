import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import Spacing from '@shared/Spacing'
import Layout from '@shared/Layout'
import FixedBottomMenuButton from '@shared/FixedBottomMenuButton'
import Recommendation from '@components/home/Recommendation'
import MyNFTs from '@components/home/MyNFTs'
import MyBungs from '@components/home/MyBungs'
import Header from '@components/home/Header'
import { fetchUserInfo } from '@apis/users/fetchUserInfo/api'

export default async function HomePage() {
  const token = cookies().get('ACCESSTOKEN')?.value
  if (token == null) {
    redirect('/signin')
  }

  const { data: userInfo } = await fetchUserInfo()

  return (
    <Layout className='bg-gray-lighten dark:bg-[url("/images/bg_home_gradient.png")] dark:bg-cover'>
      <div className='h-full overflow-y-auto'>
        <Header nickname={userInfo.nickname} />
        <Spacing size={95} />
        <MyNFTs />
        <Spacing size={40} />
        <MyBungs />
        <Spacing size={40} />
        <Recommendation />
        <Spacing size={40} />
      </div>
      <FixedBottomMenuButton />
    </Layout>
  )
}
