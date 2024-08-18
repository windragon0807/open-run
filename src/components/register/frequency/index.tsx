import Spacing from '@shared/Spacing'
import { WeekCount } from '@models/register'
import NumberDial from '../pace/NumberDial'
import { useNumberDial } from '../pace/hooks/useNumberDial'

export default function Frequency({
  frequency = 0,
  setFrequency,
}: {
  frequency?: WeekCount
  setFrequency: (frequency: WeekCount) => void
}) {
  const {
    value,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
  } = useNumberDial({
    initialValue: frequency,
    min: 0,
    max: 7,
    onChange: (newValue) => setFrequency(newValue as WeekCount),
  })

  return (
    <section className='flex flex-col items-center'>
      <Spacing size={60} />
      <p className='text-2xl text-center'>얼마나 자주 뛰시나요?</p>
      <p className='text-2xl text-primary font-bold text-center'>나의 일주일 러닝 횟수는</p>
      <Spacing size={40} />

      <div className='flex items-center justify-center'>
        <div className='relative w-86 h-[320px] overflow-hidden touch-none'>
          <NumberDial
            value={value}
            min={1}
            max={7}
            digits={1}
            onChange={(newValue) => setFrequency(newValue as WeekCount)}
            handleTouchStart={handleTouchStart}
            handleTouchMove={handleTouchMove}
            handleTouchEnd={handleTouchEnd}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            handleWheel={handleWheel}
          />
        </div>
      </div>

      <Spacing size={40} />
      <button className='w-full bg-blue-500 text-white py-4 rounded-lg'>다음</button>
    </section>
  )
}
