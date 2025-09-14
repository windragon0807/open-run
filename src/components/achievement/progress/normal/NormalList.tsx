import CircularProgress, { QuestionMarkImage, RandomGiftImage } from '../CircularProgress'
import RewardStatus from '../RewardStatus'
import NormalItem from './NormalItem'

export default function NormalList() {
  return (
    <section className='p-16'>
      <NormalItem
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
