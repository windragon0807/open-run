'use client'

import { useRouter } from 'next/navigation'
import { Fragment } from 'react'
import Spacing from '@shared/Spacing'
import { useMyBungsQuery } from '@apis/bungs/fetchMyBungs/query'
import { usePermissionStore } from '@store/permission'
import { useModalContext } from '@contexts/ModalContext'
import withBoundary from '@shared/withBoundary'
import ErrorFallback from '@shared/Error'
import Skeleton from '@shared/Skeleton'
import CreateBungButton from './CreateBungButton'
import BungCard from './BungCard'
import PermissionAlertModal from './modals/PermissionAlertModal'

export default function ScheduledBungs() {
  return (
    <section className='px-16 flex flex-col gap-8'>
      <WrappedBungList />
      <CreateBungButton>벙 만들기</CreateBungButton>
    </section>
  )
}

function BungList() {
  const router = useRouter()
  const { geolocation } = usePermissionStore()
  const { openModal } = useModalContext()

  /* 실시간 타이머를 포함하고 있는 컴포넌트는 클라이언트 컴포넌트로 렌더링해야 합니다. */
  const { data: myBungs } = useMyBungsQuery({
    isOwned: null,
    status: null,
    page: 0,
    limit: 10,
  })

  const handleClick = (bungId: string) => {
    if (geolocation === false) {
      openModal({
        contents: <PermissionAlertModal />,
      })
      return
    }

    router.push(`/bung/${bungId}`)
  }

  return (
    <>
      <div className='flex justify-between w-full max-w-[500px] mx-auto mb-8'>
        <span className='text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-black-default'>참여 예정</span>
        {myBungs!.list.length === 0 && (
          <span className='text-[12px] leading-[16px] tracking-[-0.24px] text-black-default place-content-center'>
            아직 일정이 없어요
          </span>
        )}
      </div>
      {myBungs!.list.map((item, index) => (
        <Fragment key={index}>
          <button className='text-start' onClick={() => handleClick(item.bungId)}>
            <BungCard
              place={item.location}
              time={item.startDateTime}
              distance={item.distance}
              pace={item.pace}
              isBungOwner={item.hasOwnership}
              title={item.name}
            />
          </button>
          <Spacing size={8} />
        </Fragment>
      ))}
    </>
  )
}

function BungListLoadingFallback() {
  return (
    <>
      <div className='flex justify-between w-full max-w-[500px] mx-auto mb-8'>
        <span className='text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-black-default'>참여 예정</span>
      </div>
      {Array(3)
        .fill(null)
        .map((_, index) => (
          <Skeleton key={index} className='w-full h-184 bg-gray-default rounded-16 mb-8' />
        ))}
    </>
  )
}

function BungListErrorFallback() {
  return (
    <>
      <div className='flex justify-between w-full max-w-[500px] mx-auto mb-8'>
        <span className='text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-black-default'>참여 예정</span>
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
