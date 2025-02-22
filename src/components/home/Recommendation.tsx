'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { usePermissionStore } from '@store/permission'
import { useBungsQuery } from '@apis/bungs/fetchBungs/query'
import Skeleton from '@shared/Skeleton'
import ErrorFallback from '@shared/Error'
import withBoundary from '@shared/withBoundary'
import RecommendationCard from './RecommendationCard'
import { useAlertStore } from '@store/alert'

export default function Recommendation() {
  return (
    <section className='px-16 flex flex-col pb-60'>
      <div className='flex justify-between items-center w-full max-w-[500px] mx-auto mb-8'>
        <span className='text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-black-default'>추천</span>
      </div>
      <WrappedRecommendationBungs />
    </section>
  )
}

function RecommendationBungs() {
  const router = useRouter()
  const { geolocation } = usePermissionStore()
  const { openAlert } = useAlertStore()

  const { data: recommendationList } = useBungsQuery({
    isAvailableOnly: true,
    page: 0,
    limit: 10,
  })

  const handleClick = (bungId: string) => {
    if (geolocation === false) {
      openAlert({
        title: '서비스 접근 권한 안내',
        description: `위치 권한 사용을 거부하였습니다. 기능 사용을 원하실 경우 휴대폰설정 > 애플리케이션 관리자에서 해당 앱의 권한을 허용해주세요.`,
      })
      return
    }

    router.push(`/bung/${bungId}`)
  }

  return (
    <section className='flex flex-col gap-8'>
      {recommendationList?.list.map((bung) => (
        <button key={bung.bungId} className='text-start' onClick={() => handleClick(bung.bungId)}>
          <RecommendationCard
            backgroundImageUrl={bung.mainImage as string}
            title={bung.name}
            location={bung.location}
            time={bung.startDateTime}
            remainingCount={bung.memberNumber}
            hashtags={bung.hashtags}
          />
        </button>
      ))}
      {recommendationList?.list.length === 0 && (
        <div className='flex flex-col gap-8 justify-center items-center w-full h-full'>
          <Image src='/images/home/skewed_x_button.png' alt='기울어진 X 버튼 이미지' width={56} height={56} />
          <p className='text-center text-gray-darken text-sm'>
            현재 열림 벙이 없어요 <br />
            새로운 벙을 만들어 멤버를 모집해 보세요!
          </p>
        </div>
      )}
    </section>
  )
}

function RecommendationLoadingFallback() {
  return (
    <section className='flex flex-col gap-8'>
      {Array(2)
        .fill(null)
        .map((_, index) => (
          <Skeleton key={index} className='w-full h-184 bg-gray-default rounded-16 mb-8' />
        ))}
    </section>
  )
}

function RecommendationErrorFallback() {
  return (
    <section className='w-full h-200'>
      <ErrorFallback type='medium' />
    </section>
  )
}

const WrappedRecommendationBungs = withBoundary(RecommendationBungs, {
  onLoading: <RecommendationLoadingFallback />,
  onError: <RecommendationErrorFallback />,
})
