import Spacing from '@shared/Spacing'
import NumberPicker from './NumberPicker'

export default function Pace({ pace, setPace }: { pace: string; setPace: (pace: string) => void }) {
  return (
    <div className='w-full h-full flex flex-col items-center'>
      <Spacing size={60 + 64} />
      <div className='text-4xl text-center mt-10'>평균 페이스를 알려주세요</div>
      <div className='text-4xl text-primary font-bold text-center mb-10'>나의 평균 페이스는</div>
      <Spacing size={40} />
      <NumberPicker
        defaultValue={pace}
        onChange={setPace}
        minMinutes={0}
        maxMinutes={20}
        minSeconds={0}
        maxSeconds={59}
      />
    </div>
  )
}
