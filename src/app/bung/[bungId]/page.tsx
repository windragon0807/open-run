import { Metadata } from 'next'
import { Suspense } from 'react'
import BungDetails from '@components/bung/BungDetails'
import AuthGuard from '@shared/AuthGuard'
import Layout from '@shared/Layout'
import Skeleton from '@shared/Skeleton'
import { fetchBungDetail } from '@apis/bungs/fetchBungDetails/api'

type Props = {
  params: {
    bungId: string
  }
}

export default async function Page({ params: { bungId } }: Props) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BungDetailPage bungId={bungId} />
    </Suspense>
  )
}

async function BungDetailPage({ bungId }: { bungId: string }) {
  const bungDetail = await fetchBungDetail({ bungId })
  return (
    <AuthGuard loadingFallback={<LoadingFallback />}>
      <Layout>
        <BungDetails details={bungDetail.data} />
      </Layout>
    </AuthGuard>
  )
}

export async function generateMetadata({ params: { bungId } }: Props): Promise<Metadata> {
  const bungDetail = await fetchBungDetail({ bungId })
  return {
    title: bungDetail.data.name,
  }
}

function LoadingFallback() {
  return (
    <section className='flex h-screen w-screen flex-col bg-gray-lighten'>
      <div className='h-200 bg-gray' />
      <div className='-translate-y-15 rounded-[8px_8px_0_0] bg-gray-lighten'>
        <div className='mb-24 rounded-8 bg-white p-16 shadow-floating-primary'>
          <Skeleton className='mb-16 h-30 w-180 rounded-10 bg-gray' />
          <Skeleton className='mb-8 h-19 w-180 rounded-10 bg-gray' />
          <Skeleton className='mb-8 h-19 w-180 rounded-10 bg-gray' />
          <Skeleton className='mb-8 h-19 w-180 rounded-10 bg-gray' />
          <Skeleton className='mb-24 h-19 w-180 rounded-10 bg-gray' />
          <Skeleton className='h-56 w-full rounded-10 bg-gray' />
        </div>
        <Skeleton className='mb-8 ml-16 h-24 w-152 rounded-10 bg-gray' />
        <ul className='flex gap-8 px-16'>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`${index}`} className='aspect-[1] w-76 rounded-8 bg-gray' />
          ))}
        </ul>
      </div>
    </section>
  )
}
