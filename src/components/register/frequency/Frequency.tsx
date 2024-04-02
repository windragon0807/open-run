import Spacing from '@shared/Spacing'
import { WeekCount } from '@models/register'
import Title from '../shared/Title'
import SubTitle from '../shared/SubTitle'
import Emoji from '../shared/Emoji'
import Slider from './Slider'

export default function Frequency({
  frequency = 0,
  setFrequency,
}: {
  frequency?: WeekCount
  setFrequency: (frequency: WeekCount) => void
}) {
  return (
    <section className='flex flex-col items-center'>
      <Emoji>🎯</Emoji>
      <Spacing size={20} />
      <Title>일주일에 몇 번 뛰나요?</Title>
      <Spacing size={10} />
      <SubTitle>당신의 목표를 알려주세요!</SubTitle>

      <Spacing size={20} />

      <span className='text-white text-2xl font-bold'>{frequency}일</span>
      <Spacing size={20} />
      <Slider value={frequency} onChange={(_, value) => setFrequency(value as WeekCount)} min={0} max={7} />
      <Spacing size={20} />
      <div className='w-320 text-sm text-white flex justify-between'>
        <span>0일</span>
        <span>7일</span>
      </div>
    </section>
  )
}
