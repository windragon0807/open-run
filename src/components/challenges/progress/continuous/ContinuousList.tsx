import ErrorFallback from '@shared/ErrorFallback'
import withBoundary from '@shared/withBoundary'
import { ArrowRightIcon } from '@icons/arrow'
// import { fetchContinuousChallengeList } from '@apis/v1/challenges/continuous'
import { colors } from '@styles/colors'
import CircularProgress, { RandomGiftImage } from '../CircularProgress'
import RewardStatus from '../RewardStatus'

async function ContinuousList() {
  // await fetchContinuousChallengeList()

  return (
    <section className='p-16'>
      <button className='grid w-full grid-cols-[60px_1fr_auto] place-items-center gap-8 rounded-8 bg-white px-16 py-10 active-press-duration active:scale-95 active:bg-gray/30'>
        <CircularProgress progress={40} total={100}>
          <RandomGiftImage />
        </CircularProgress>
        <p className='flex w-full items-center justify-between gap-8 justify-self-start text-left text-14 font-bold'>
          광화문 광장에서 1km 달리기
        </p>
        <div className='flex items-center gap-4'>
          <RewardStatus progress={4} total={10} />
          <ArrowRightIcon size={16} color={colors.black.darkest} />
        </div>
      </button>
    </section>
  )
}

export default withBoundary(ContinuousList, {
  onLoading: (
    <section className='flex flex-col gap-8 p-16'>
      <div className='h-80 w-full animate-pulse rounded bg-gray' />
      <div className='h-80 w-full animate-pulse rounded bg-gray' />
      <div className='h-80 w-full animate-pulse rounded bg-gray' />
    </section>
  ),
  onError: (
    <section className='pt-60'>
      <ErrorFallback type='medium' />
    </section>
  ),
})
