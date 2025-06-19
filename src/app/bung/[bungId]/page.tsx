import { Metadata } from 'next'
import { Suspense } from 'react'
import PageCategory from '@components/bung/PageCategory'
import AuthGuard from '@shared/AuthGuard'
import Skeleton from '@shared/Skeleton'
import { fetchBungDetail } from '@apis/bungs/fetchBungDetails/api'
import { fetchUserInfo } from '@apis/users/fetchUserInfo/api'

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
  const [{ data: userInfo }, bungDetail] = await Promise.all([fetchUserInfo(), fetchBungDetail({ bungId })])

  const userId = userInfo.userId
  const isParticipated = bungDetail.data.memberList.some((participant) => participant.userId === userId)
  const isOwner = bungDetail.data.memberList.find((participant) => participant.userId === userId)?.owner ?? false

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthGuard>
        <PageCategory details={bungDetail.data} isParticipated={isParticipated} isOwner={isOwner} />
      </AuthGuard>
    </Suspense>
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
      <div className='bg-gray h-200' />
      <div className='-translate-y-15 rounded-[8px_8px_0_0] bg-gray-lighten'>
        <div className='mb-24 rounded-8 bg-white p-16 shadow-floating-primary'>
          <Skeleton className='bg-gray mb-16 h-30 w-180 rounded-10' />
          <Skeleton className='bg-gray mb-8 h-19 w-180 rounded-10' />
          <Skeleton className='bg-gray mb-8 h-19 w-180 rounded-10' />
          <Skeleton className='bg-gray mb-8 h-19 w-180 rounded-10' />
          <Skeleton className='bg-gray mb-24 h-19 w-180 rounded-10' />
          <Skeleton className='bg-gray h-56 w-full rounded-10' />
        </div>
        <Skeleton className='bg-gray mb-8 ml-16 h-24 w-152 rounded-10' />
        <ul className='flex gap-8 px-16'>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`${index}`} className='bg-gray aspect-[1] w-76 rounded-8' />
          ))}
        </ul>
      </div>
    </section>
  )
}
