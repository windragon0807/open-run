import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useModal } from '@contexts/ModalProvider'
import { usePermissionStore } from '@store/permission'
import AlertModal from '@shared/AlertModal'
import ErrorFallback from '@shared/Error'
import Skeleton from '@shared/Skeleton'
import withBoundary from '@shared/withBoundary'
import { useBungsQuery } from '@apis/bungs/fetchBungs/query'
import { MODAL_KEY } from '@constants/modal'
import RecommendationCard from './RecommendationCard'

export default function Recommendation() {
  return (
    <section className='flex flex-col px-16 pb-60'>
      <div className='mx-auto mb-8 flex w-full max-w-[500px] items-center justify-between'>
        <span className='text-black text-20 font-bold'>추천</span>
      </div>
      <WrappedRecommendationBungs />
    </section>
  )
}

function RecommendationBungs() {
  const router = useRouter()
  const { isGeolocationPermissionGranted } = usePermissionStore()
  const { showModal } = useModal()

  const { data: recommendationList } = useBungsQuery({
    isAvailableOnly: true,
    page: 0,
    limit: 10,
  })

  const handleClick = (bungId: string) => {
    if (isGeolocationPermissionGranted === false) {
      showModal({
        key: MODAL_KEY.ALERT,
        component: (
          <AlertModal
            title='서비스 접근 권한 안내'
            description='위치 권한 사용을 거부하였습니다. 기능 사용을 원하실 경우 휴대폰설정 > 애플리케이션 관리자에서 해당 앱의 권한을 허용해주세요.'
          />
        ),
      })
      return
    }

    router.push(`/bung/${bungId}`)
  }

  return (
    <section className='flex flex-col gap-8'>
      {recommendationList?.data.map((bung) => (
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
      {recommendationList?.data.length === 0 && (
        <div className='mt-32 flex h-full w-full flex-col items-center justify-center gap-8'>
          <Image src='/images/home/skewed_x_button.png' alt='기울어진 X 버튼 이미지' width={56} height={56} />
          <p className='text-center text-14 text-gray-darken'>
            현재 열린 벙이 없어요 <br />
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
          <Skeleton key={index} className='bg-gray mb-8 h-184 w-full rounded-16' />
        ))}
    </section>
  )
}

function RecommendationErrorFallback() {
  return (
    <section className='h-200 w-full'>
      <ErrorFallback type='medium' />
    </section>
  )
}

const WrappedRecommendationBungs = withBoundary(RecommendationBungs, {
  onLoading: <RecommendationLoadingFallback />,
  onError: <RecommendationErrorFallback />,
})
