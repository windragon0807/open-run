import Spacing from '@shared/Spacing'
import { WeekCount } from '@models/register'
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
      <Spacing size={60 + 64} />
      <p className='text-4xl text-center'>얼마나 자주 뛰시나요?</p>
      <p className='text-4xl text-primary font-bold text-center'>나의 일주일 러닝 횟수는</p>
      <Spacing size={40} />

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
