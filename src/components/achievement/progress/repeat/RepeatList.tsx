import { ArrowRightIcon } from '@/components/icons/arrow'
import { colors } from '@/styles/colors'
import CircularProgress, { QuestionMarkImage, RandomGiftImage } from '../CircularProgress'
import RewardStatus from '../RewardStatus'

export default function RepeatList() {
  return (
    <section className='p-16'>
      <button className='grid w-full grid-cols-[60px_1fr_auto] place-items-center gap-8 rounded-8 bg-white px-16 py-10'>
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
