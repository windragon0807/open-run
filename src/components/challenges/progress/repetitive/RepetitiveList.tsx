import ErrorFallback from '@shared/ErrorFallback'
import withBoundary from '@shared/withBoundary'
import { ArrowRightIcon } from '@icons/arrow'
import { fetchRepetitiveChallengeList } from '@apis/v1/challenges/repetitive'
import { colors } from '@styles/colors'
import CircularProgress, { RandomGiftImage } from '../CircularProgress'
import RewardStatus from '../RewardStatus'

async function RepetitiveList() {
  const response = await fetchRepetitiveChallengeList()
  console.log(response)

  return (
    <section className='p-16'>
      <button className='group w-full rounded-8 bg-white px-16 py-10 active-press-duration active:bg-gray/30'>
        <div className='grid grid-cols-[60px_1fr_auto] place-items-center gap-8 active-press-duration group-active:scale-98'>
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
        </div>
      </button>
    </section>
  )
}

export default withBoundary(RepetitiveList, {
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
