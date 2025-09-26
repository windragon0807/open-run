import ErrorFallback from '@shared/ErrorFallback'
import withBoundary from '@shared/withBoundary'
import { fetchGeneralChallengeList } from '@apis/v1/challenges/general'
import CircularProgress, { RandomGiftImage } from '../CircularProgress'
import RewardStatus from '../RewardStatus'
import GeneralItem from './GeneralItem'

async function GeneralList() {
  await fetchGeneralChallengeList()

  return (
    <section className='p-16'>
      <GeneralItem
        progressNode={
          <CircularProgress progress={40} total={100}>
            <RandomGiftImage />
          </CircularProgress>
        }
        title='광화문 광장에서 1km 달리기'
        description='광화문 광장에서 1km 달리기 광화문 광장에서 1km 달리기'
        rewardStatusNode={<RewardStatus progress={4} total={10} />}
      />
    </section>
  )
}

export default withBoundary(GeneralList, {
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
