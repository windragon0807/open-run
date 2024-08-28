import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import Spacing from '@shared/Spacing'
import Layout from '@shared/Layout'
import Recommendation from '@components/home/Recommendation'
import MyNFTs from '@components/home/MyNFTs'
import MyBungs from '@components/home/MyBungs'
import Header from '@components/home/Header'

export default async function HomePage() {
  const token = cookies().get('ACCESSTOKEN')?.value
  if (token == null) {
    redirect('/signin')
  }

  return (
    <Layout className='bg-gray-lighten'>
      <div className='h-full overflow-y-auto'>
        <Header />
        <Spacing size={95} />
        <MyNFTs />
        <Spacing size={40} />
        <MyBungs />
        <Spacing size={40} />
        <Recommendation />
        <Spacing size={40} />
      </div>
    </Layout>
  )
}
