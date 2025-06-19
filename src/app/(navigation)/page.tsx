'use client'

import clsx from 'clsx'
import { useAppStore } from '@store/app'
import Header from '@components/home/Header'
import Recommendation from '@components/home/Recommendation'
import ScheduledBungs from '@components/home/ScheduledBungs'
import AuthGuard from '@shared/AuthGuard'
import Layout from '@shared/Layout'
import Spacing from '@shared/Spacing'

export default function HomePage() {
  const { isApp } = useAppStore()

  return (
    <AuthGuard>
      <Layout className='relative bg-gray-lighten'>
        <div className='absolute top-0 z-10 w-full max-w-tablet'>
          <Header />
        </div>
        <div
          className={clsx(
            'relative overflow-y-auto pb-96 pt-40',
            isApp ? 'top-[242px] h-[calc(100%-242px)]' : 'top-[178px] h-[calc(100%-178px)]',
          )}>
          <ScheduledBungs />
          <Spacing size={40} />
          <Recommendation />
        </div>
      </Layout>
    </AuthGuard>
  )
}
