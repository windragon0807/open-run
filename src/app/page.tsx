import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import Spacing from '@shared/Spacing'
import Layout from '@shared/Layout'
import FixedBottomMenuButton from '@shared/FixedBottomMenuButton'
import Recommendation from '@components/home/Recommendation'
import MyNFTs from '@components/home/MyNFTs'
import MyBungs from '@components/home/MyBungs'
import Header from '@components/home/Header'
import PrePermissions from '@components/home/PrePermissions'
import { fetchUserInfo } from '@apis/users/fetchUserInfo/api'

export default async function HomePage() {
  const token = cookies().get('ACCESSTOKEN')?.value
  if (token == null) {
    redirect('/signin')
  }

  const { data: userInfo } = await fetchUserInfo()
  /* 토큰이 만료되었을 경우, 로그인 페이지로 리다이렉트 */
  if (userInfo == null) {
    redirect('/signin')
  }

  return (
    <Layout className='bg-gray-lighten'>
      <PrePermissions />
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
