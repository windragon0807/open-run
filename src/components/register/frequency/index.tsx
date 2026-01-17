import { WeekCount } from '@type/register'
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
    <section className='flex flex-col items-center pt-124 app:pt-174'>
      <p className='text-center text-28'>얼마나 자주 뛰시나요?</p>
      <p className='mb-40 text-center text-28 font-bold text-primary'>나의 일주일 러닝 횟수는</p>

      <div className='flex items-center justify-center'>
        <div className='relative h-[320px] w-86 touch-none overflow-hidden'>
          <NumberDial
            value={value}
            min={0}
            max={7}
            digits={1}
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
    </section>
  )
}
