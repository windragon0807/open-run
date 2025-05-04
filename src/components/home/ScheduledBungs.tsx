'use client'

import { useRouter } from 'next/navigation'
import { useAlertStore } from '@store/alert'
import { usePermissionStore } from '@store/permission'
import ErrorFallback from '@shared/Error'
import Skeleton from '@shared/Skeleton'
import Spacing from '@shared/Spacing'
import withBoundary from '@shared/withBoundary'
import { useMyBungsQuery } from '@apis/bungs/fetchMyBungs/query'
import BungCard from './BungCard'
import CreateBungButton from './CreateBungButton'

export default function ScheduledBungs() {
  return (
    <section className='flex flex-col gap-8 px-16'>
      <WrappedBungList />
      <CreateBungButton>벙 만들기</CreateBungButton>
    </section>
  )
}

function BungList() {
  const router = useRouter()
  const { isGeolocationPermissionGranted } = usePermissionStore()
  const { openAlert } = useAlertStore()

  /* 실시간 타이머를 포함하고 있는 컴포넌트는 클라이언트 컴포넌트로 렌더링해야 합니다. */
  const { data: myBungs } = useMyBungsQuery({
    isOwned: null,
    status: 'ONGOING',
    page: 0,
    limit: 10,
  })

  const handleClick = (bungId: string) => {
    if (isGeolocationPermissionGranted === false) {
      openAlert({
        title: '서비스 접근 권한 안내',
        description: `위치 권한 사용을 거부하였습니다. 기능 사용을 원하실 경우 휴대폰설정 > 애플리케이션 관리자에서 해당 앱의 권한을 허용해주세요.`,
      })
      return
    }

    router.push(`/bung/${bungId}`)
  }

  return (
    <>
      <div className='mx-auto mb-8 flex w-full max-w-[500px] justify-between'>
        <span className='text-20 font-bold text-black-default'>나의 벙</span>
        {myBungs!.list.length === 0 && (
          <span className='place-content-center text-12 text-black-default'>아직 일정이 없어요</span>
        )}
      </div>
      <ul>
        {myBungs!.list.map((item) => (
          <li key={`myBungs-${item.bungId}`}>
            <button className='w-full text-start' onClick={() => handleClick(item.bungId)}>
              <BungCard
                backgroundImageUrl={item.mainImage as string}
                time={item.startDateTime}
                title={item.name}
                place={item.location}
                distance={item.distance}
                pace={item.pace}
                isBungOwner={item.hasOwnership}
              />
            </button>
            <Spacing size={8} />
          </li>
        ))}
      </ul>
    </>
  )
}

function BungListLoadingFallback() {
  return (
    <>
      <div className='mx-auto mb-8 flex w-full max-w-[500px] justify-between'>
        <span className='text-20 font-bold text-black-default'>나의 벙</span>
      </div>
      {Array(3)
        .fill(null)
        .map((_, index) => (
          <Skeleton key={index} className='h-184 w-full rounded-16 bg-gray-default' />
        ))}
    </>
  )
}

function BungListErrorFallback() {
  return (
    <>
      <div className='mx-auto mb-8 flex w-full max-w-[500px] justify-between'>
        <span className='text-20 font-bold text-black-default'>나의 벙</span>
      </div>
      <div className='mb-20'>
        <ErrorFallback type='medium' />
      </div>
    </>
  )
}

const WrappedBungList = withBoundary(BungList, {
  onLoading: <BungListLoadingFallback />,
  onError: <BungListErrorFallback />,
})
